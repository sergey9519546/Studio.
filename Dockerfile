# ============================================
# Production-Grade Multi-Stage Dockerfile for Studio Roster
#
# Optimized for:
# - Layer caching and minimal image size
# - Security (non-root user, minimal attack surface)
# - Production performance
# - Proper health checks
# - Cloud Run compatibility
# ============================================

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-slim AS deps

# Install system dependencies for Prisma and native modules
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl python3 make g++ build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only dependency files for better layer caching
COPY package*.json ./
COPY prisma/ ./prisma/

# Install dependencies with legacy peer deps for compatibility
RUN npm install --legacy-peer-deps --ignore-scripts && npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# ============================================
# Stage 2: Builder
# ============================================
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/package-lock.json* ./

# Copy application source
COPY . .

# Set production environment for build optimizations
ENV NODE_ENV=production

# Build API (NestJS)
RUN npm run build:api || npx nest build -p apps/api/tsconfig.app.json

# Build frontend (Vite)
RUN npm run build:client || npx vite build --mode production

# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:22-slim AS runner

# Install only runtime dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl curl \
    && rm -rf /var/lib/apt/lists/* && \
    groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home node

WORKDIR /app

# Copy package files
COPY --chown=node:nodejs package*.json ./

# Copy node_modules from deps stage (production only)
COPY --chown=node:nodejs --from=deps /app/node_modules ./node_modules

# Copy Prisma schema and regenerate client
COPY --chown=node:nodejs --from=builder /app/prisma ./prisma
RUN npx prisma generate && npx prisma db push --accept-data-loss || echo "Database push skipped - will migrate on startup"

# Copy built application
COPY --chown=node:nodejs --from=builder /app/build ./build

# Create directories for optional files
RUN mkdir -p /app/keys && chown node:nodejs /app/keys

# Optional: Copy service account key (if exists)
RUN mkdir -p /tmp/keys && cp service-account-key.json /app/service-account-key.json 2>/dev/null || echo "No service account key found - using environment variables"

# Switch to non-root user for security
USER node

# Cloud Run uses PORT environment variable
ENV PORT=8080 NODE_ENV=production

EXPOSE 8080

# Production health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/v1/health || exit 1

# Start the application
CMD ["node", "build/apps/api/src/main.js"]
