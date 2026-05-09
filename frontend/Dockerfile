# Build stage
FROM node:20-slim AS build
WORKDIR /app

# Copy workspace packages (needed for file: dependencies)
COPY packages ./packages

# Copy frontend config
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy source and build
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm run build

# Run stage
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/frontend/package*.json ./
COPY --from=build /app/frontend/node_modules ./node_modules
COPY --from=build /app/frontend/.next ./.next
COPY --from=build /app/frontend/public ./public

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
