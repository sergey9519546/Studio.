# Stage 1: Backend Build
FROM node:20-bookworm-slim AS backend-builder

WORKDIR /app
RUN apt-get update && apt-get upgrade -y

# Copy config files
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies (FULL)
RUN npm install --legacy-peer-deps

# Generate Prisma Client
RUN npx prisma generate

# Copy ONLY backend source code
COPY apps/api ./apps/api

# Build NestJS app
RUN npx tsc -p apps/api/tsconfig.app.json --outDir /app/build/apps/api

# Stage 2: Frontend Build
FROM node:20-bookworm-slim AS frontend-builder

WORKDIR /app
# Copy node_modules from backend-builder (FULL deps needed for build)
COPY --from=backend-builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy source code
COPY . .

# Build Vite app
RUN npx vite build

# Stage 3: Production Runner
FROM node:20-bookworm-slim AS runner
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN apt-get update && apt-get upgrade -y && apt-get install -y openssl ca-certificates

# Copy node_modules from backend-builder (FULL deps)
COPY --from=backend-builder /app/node_modules ./node_modules

# Generate Prisma Client
RUN npx prisma generate

# Copy built artifacts
COPY --from=backend-builder /app/build /app/build
COPY --from=frontend-builder /app/dist/client /app/dist/client

EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node /app/build/apps/api/src/main.js"]
