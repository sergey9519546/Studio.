# Production-Grade Multi-Stage Dockerfile for Cloud Run
# Optimized for layer caching, security, and minimal image size

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-alpine AS deps

WORKDIR /app

# Install system dependencies required for Prisma
RUN apk add --no-cache libc6-compat openssl

# Copy only dependency files for better layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (cached unless package.json changes)
RUN npm ci --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# ============================================
# Stage 2: Builder
# ============================================
FROM node:22-alpine AS builder

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
RUN npm run build || npx vite build

# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

# Install only OpenSSL for Prisma runtime
RUN apk add --no-cache openssl

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install ALL dependencies (Nx builds don't bundle, they need node_modules)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy Prisma files and generate client
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/build ./build

# Set ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Cloud Run uses PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "build/apps/api/src/main.js"]
