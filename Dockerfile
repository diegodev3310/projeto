# Image: Node.js 22.11.0 Slim
# Description: A Dockerfile for building and running a Node.js application in production mode.
FROM node:22.11.0-slim as base

# Set the working directory
WORKDIR /app

# Install Chromium dependencyies
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the application source code
COPY server.js ./
COPY public ./public
COPY src ./src

# Production stage
# Set the environment to production
ENV NODE_ENV=production
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]