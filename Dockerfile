# Production-Grade Multi-Stage Dockerfile for Cloud Run
# Optimized for layer caching, security, and minimal image size

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-slim AS deps

WORKDIR /app

# Install system dependencies for native modules
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl python3 make g++ build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only dependency files for better layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --legacy-peer-deps

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

# Copy application source
COPY . .

# Set production environment
ENV NODE_ENV=production

# Build API
RUN npm run build:api || npx nest build -p apps/api/tsconfig.app.json

# Build frontend (Vite)
RUN npm run build:client || npx vite build

# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:22-slim AS runner

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first
COPY --chown=node:node package*.json ./

# Copy node_modules from deps stage
COPY --chown=node:node --from=deps /app/node_modules ./node_modules

# Copy Prisma files and regenerate client
COPY --chown=node:node --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy built application from builder
COPY --chown=node:node --from=builder /app/build ./build

# Copy service account key if it exists (optional)
COPY --chown=node:node service-account-key.jso[n] /app/

# Switch to non-root user
USER node

# Cloud Run uses PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "build/apps/api/src/main.js"]
