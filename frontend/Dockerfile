# Build stage
FROM node:20-slim AS build
WORKDIR /app

# Copy workspace configuration and all package.json files for better layer caching
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/diagram-engine/package*.json ./packages/diagram-engine/
COPY packages/parser-client/package*.json ./packages/parser-client/
COPY packages/persistence/package*.json ./packages/persistence/
COPY packages/validation/package*.json ./packages/validation/

# Install all workspace dependencies
RUN npm install --include=optional

# The root package-lock.json was generated on Windows, so the Linux-specific
# lightningcss native binary (needed by @tailwindcss/postcss at build time) is
# NOT present in frontend/node_modules/lightningcss-linux-x64-gnu.
# We explicitly install it into the frontend package to unblock the build.
RUN npm install --prefix /app/frontend \
    lightningcss-linux-x64-gnu@1.32.0 \
    --no-save --include=optional

# Copy the rest of the source code
COPY packages ./packages
COPY frontend ./frontend

# Build the frontend
WORKDIR /app/frontend
ENV NEXT_PUBLIC_SUPABASE_URL="https://dummy.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="dummy-key"
RUN npm run build

# Run stage - lean production image
FROM node:20-slim
WORKDIR /app

# Copy built assets and workspace node_modules for runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/frontend/.next ./frontend/.next
COPY --from=build /app/frontend/public ./frontend/public
COPY --from=build /app/frontend/package*.json ./frontend/
COPY --from=build /app/frontend/node_modules ./frontend/node_modules

# Copy packages for @repo/* module resolution at runtime
COPY --from=build /app/packages ./packages

EXPOSE 3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
WORKDIR /app/frontend
CMD ["npm", "start"]
