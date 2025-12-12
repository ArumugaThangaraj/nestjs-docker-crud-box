# ========= BUILDER =========
FROM node:20-alpine AS builder

WORKDIR /app

# Install only production dependencies first (caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the NestJS app
RUN npm run build

# ========= PRODUCTION =========
FROM node:20-alpine

WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Optional: Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]