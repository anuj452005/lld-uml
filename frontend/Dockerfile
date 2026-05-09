# Build stage
FROM node:20-slim AS build
WORKDIR /app

# Copy all workspace files
COPY package*.json ./
COPY packages ./packages
COPY frontend ./frontend

# Install dependencies for the whole workspace (if applicable) or just frontend
WORKDIR /app/frontend
RUN npm install

# Build the frontend
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
