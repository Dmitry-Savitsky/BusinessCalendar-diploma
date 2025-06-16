FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Build the widget
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

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

# Install only production dependencies
RUN pnpm install --prod

USER expressjs

EXPOSE 3001

CMD ["node", "server.js"] 