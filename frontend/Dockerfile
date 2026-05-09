# Build stage
FROM node:20-slim AS build
WORKDIR /app

# Copy workspace configuration and all package.json files for better caching
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/diagram-engine/package*.json ./packages/diagram-engine/
COPY packages/parser-client/package*.json ./packages/parser-client/
COPY packages/persistence/package*.json ./packages/persistence/
COPY packages/validation/package*.json ./packages/validation/

# Install dependencies for the whole workspace
RUN npm install

# Copy the rest of the source code
COPY packages ./packages
COPY frontend ./frontend

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Run stage
FROM node:20-slim
WORKDIR /app

# Copy built assets and necessary files for runtime
# Note: We copy the workspace node_modules from the root
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public
COPY --from=build /app/frontend/package*.json ./frontend/

# Also copy the packages for potential runtime references if needed
COPY --from=build /app/packages ./packages

EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /app/frontend
CMD ["npm", "start"]
