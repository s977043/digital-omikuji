# Dockerfile
FROM node:20-bullseye

# Install tools
RUN npm install -g eas-cli

# Workdir
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Default command
CMD ["npx", "expo", "start", "--host", "lan"]
