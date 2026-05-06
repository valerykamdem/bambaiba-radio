# Stage 1: Build
# 1. Construction
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Exécution
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# On copie tout le dossier de build et les fichiers de conf s'ils existent
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

COPY --from=builder /app/next.config.* ./

EXPOSE 3000
CMD ["npm", "start"]
