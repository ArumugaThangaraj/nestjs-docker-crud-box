# ========= BUILDER =========
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build NestJS
RUN npm run build

# ========= PRODUCTION =========
FROM node:20-alpine

WORKDIR /app

# Copy only what is needed for runtime
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./package.json

# Create user for security
RUN addgroup -S nodejs && adduser -S nestjs -G nodejs
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]
