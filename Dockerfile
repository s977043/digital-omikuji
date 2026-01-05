# Dockerfile for Expo React Native Development
# Based on: https://zenn.dev/iput_app/articles/8051d4ad7e03bf
FROM node:22-alpine

# Install git and other tools
RUN apk update && apk add git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies with shamefully-hoist for Expo compatibility
RUN pnpm install --shamefully-hoist

# Copy source code
COPY . .

# Expose Metro bundler port
EXPOSE 8081
