# Stage 1: Backend Build
FROM node:22-bookworm-slim AS backend-builder

WORKDIR /app
RUN apt-get update && apt-get upgrade -y

# Copy config files
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Copy ONLY backend source code
COPY apps/api ./apps/api

# Build NestJS app using tsc directly to avoid nest build magic
RUN npx tsc -p apps/api/tsconfig.app.json

# Stage 2: Frontend Build
FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app
RUN apt-get update && apt-get upgrade -y

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy EVERYTHING for frontend build (Vite needs root src, components, etc.)
COPY . .

# Build Vite app
RUN npx vite build

# Stage 3: Production Runner
FROM node:22-bookworm-slim AS runner

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install production dependencies and system requirements
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y openssl && \
    npm install --omit=dev --legacy-peer-deps

# Generate Prisma Client (needs schema)
RUN npx prisma generate

# Copy built artifacts
COPY --from=backend-builder /app/dist/apps/api ./dist/apps/api
COPY --from=frontend-builder /app/dist/client ./dist/client

EXPOSE 3000

CMD ["node", "dist/apps/api/src/main.js"]
