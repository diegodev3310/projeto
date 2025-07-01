# Image: Node.js 22.11.0 Slim
# Description: A Dockerfile for building and running a Node.js application in production mode.
FROM node:22.11.0-slim as base

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the application source code
COPY server.js ./
COPY public ./public

# Production stage
# Set the environment to production
ENV NODE_ENV=production
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]