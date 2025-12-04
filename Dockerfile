# Optimized single-stage production build for Cloud Run
FROM node:20.18.0-bookworm-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y openssl ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Copy all source files
COPY . .

# Install dependencies (using npm install to be more lenient than npm ci)
RUN npm install -g node-gyp
RUN npm install --legacy-peer-deps

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

# Cloud Run uses PORT 8080
EXPOSE 8080

# FAST STARTUP: No migrations on container start - run them separately
# This ensures the container starts in seconds, not minutes
CMD ["node", "dist/apps/api/src/main.js"]
