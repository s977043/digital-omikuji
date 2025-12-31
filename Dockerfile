# Dockerfile
FROM node:20-bullseye

# Install pnpm and tools
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm add -g eas-cli

# Workdir
WORKDIR /app

# Copy package files first for layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Default command
CMD ["npx", "expo", "start", "--host", "0.0.0.0"]
