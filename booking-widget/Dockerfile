FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN echo "yes" | pnpm install
RUN echo "yes" | pnpm add express cors graceful-fs ts-node typescript @types/node

# Build the widget
FROM base AS builder
WORKDIR /app

# Install pnpm in builder stage as well
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure webpack and its dependencies are installed
RUN echo "yes" | pnpm install
RUN echo "yes" | pnpm add express cors graceful-fs ts-node typescript @types/node

# Build the widget
RUN pnpm build:widget

# Production image, copy all the files and run express server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy built files and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js .
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/tsconfig.json .

USER expressjs

EXPOSE 3001

CMD ["node", "-r", "ts-node/register", "server.js"] 