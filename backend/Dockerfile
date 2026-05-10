# Build stage - compile TypeScript
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage - production only, no devDependencies
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist

EXPOSE 3005
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
