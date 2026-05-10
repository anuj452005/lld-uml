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

# Install ALL dependencies (including dev and optional) for the build.
# --include=optional ensures platform-specific native binaries (e.g. lightningcss-linux-x64-gnu)
# are installed even when they are marked optional in the lockfile.
RUN npm install --include=optional

# Copy the rest of the source code
COPY packages ./packages
COPY frontend ./frontend

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Run stage - lean production image
FROM node:20-slim
WORKDIR /app

# Copy built assets and necessary files for runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public
COPY --from=build /app/frontend/package*.json ./frontend/

# Copy packages for workspace module resolution at runtime
COPY --from=build /app/packages ./packages

EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /app/frontend
CMD ["npm", "start"]
