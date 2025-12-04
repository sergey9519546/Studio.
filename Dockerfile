# Single-stage production build for Cloud Run
FROM node:20.18.0-bookworm-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy all source files
COPY . .

# Install dependencies with all flags to avoid issues
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Build the API
RUN npm run build:api || npx nest build -p apps/api/tsconfig.app.json

# Build the frontend (Vite)
ENV NODE_ENV=production
RUN npm run build || npx vite build

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start with migrations
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/apps/api/src/main.js"]
