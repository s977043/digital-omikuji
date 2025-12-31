# =============================================================================
# Stage 1: Dependencies - Install dependencies for caching
# =============================================================================
FROM node:20-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# =============================================================================
# Stage 2: Builder - Build the application
# =============================================================================
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build for web (optional - uncomment if needed)
# RUN pnpm run build

# =============================================================================
# Stage 3: Development - For local development with hot reload
# =============================================================================
FROM node:20-alpine AS development

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Default command for development
CMD ["pnpm", "start", "--host", "0.0.0.0"]

# =============================================================================
# Stage 4: Production - Minimal image for serving web build
# =============================================================================
FROM node:20-alpine AS production

# Install pnpm and serve
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && npm install -g serve

WORKDIR /app

# Copy built assets from builder (for web deployment)
# COPY --from=builder /app/dist ./dist

# Copy dependencies and source for Expo
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expose port for web server
EXPOSE 3000

# Default command - serve the web build
# CMD ["serve", "-s", "dist", "-l", "3000"]
CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]

# =============================================================================
# Stage 5: EAS Build - For Expo Application Services builds
# =============================================================================
FROM node:20-bullseye AS eas-build

# Install pnpm and EAS CLI
RUN corepack enable && corepack prepare pnpm@latest --activate \
    && pnpm add -g eas-cli

WORKDIR /app

# Copy package files first for layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# EAS build command will be run manually
CMD ["bash"]
