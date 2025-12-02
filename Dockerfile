# Stage 1: Backend Build
FROM node:20.18.0-bookworm-slim AS backend-builder

WORKDIR /app
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install ALL dependencies (needed for build)
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Copy backend source code
COPY apps/api ./apps/api

# Build NestJS app
RUN npx tsc -p apps/api/tsconfig.app.json --outDir /app/build/apps/api

# Stage 2: Frontend Build
FROM node:20.18.0-bookworm-slim AS frontend-builder

WORKDIR /app

# Copy node_modules from backend builder
COPY --from=backend-builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy all frontend source
COPY . .

# Build Vite app (production mode)
ENV NODE_ENV=production
RUN npx vite build

# Stage 3: Production Runtime
FROM node:20.18.0-bookworm-slim AS runner

WORKDIR /app

# Install only production dependencies and required system packages
COPY package*.json ./
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    npm install --production --legacy-peer-deps && \
    npm cache clean --force

# Copy Prisma files
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma Client
RUN npx prisma generate

# Copy built artifacts from builders
COPY --from=backend-builder /app/build /app/build
COPY --from=frontend-builder /app/build/client /app/build/client

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start application
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node /app/build/apps/api/src/main.js"]
