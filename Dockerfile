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

# Create a non-root user for security (Least Privilege Principle)
# Running as root inside a container is a security risk
USER node

# Copy the rest of the application code
# Ensure the node user owns the files
COPY --chown=node:node . .

# SQLite needs to write to the database file. 
# In a containerized env, it's best to use a volume or ensure 
# the app has write permissions in its directory.
# Since we are node user, we can write to /app because base image set it up.

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
