# Optimized single-stage production build for Cloud Run
FROM node:20.18.0-bookworm-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y openssl ca-certificates python3 make g++ libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy all source files
COPY . .

# Install dependencies (using npm install to be more lenient than npm ci)
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
ENV PRISMA_CLI_BINARY_TARGETS=debian-openssl-3.0.x
RUN npm install -g node-gyp
RUN npm install --legacy-peer-deps

# Generate Prisma client
RUN apt-get install -y file
RUN openssl version
RUN ls -la node_modules/.bin/prisma
RUN file node_modules/.bin/prisma
# Try running via node directly if the bin is a script or symlink
RUN node node_modules/prisma/build/index.js -v || true
RUN ./node_modules/.bin/prisma -v || true
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
