# --- Stage 1: Build & Dependencies ---
# Using the slim alpine image for a small footprint (~100MB vs ~1GB)
FROM node:20-alpine AS base

# Set production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
# Changes in code won't trigger a re-install of dependencies
COPY package*.json ./

# Install only production dependencies
# 'npm ci' is faster and more reliable for CI/CD than 'npm install'
RUN npm ci --only=production

# --- Stage 2: Final Image ---
FROM base AS runner

# Set working directory again to be sure
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Ensure the node user owns the entire app directory
# This is crucial for SQLite to create/write the database file
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose the application port (Render will override this via ENV PORT)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
