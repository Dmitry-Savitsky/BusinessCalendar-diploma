FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Build the widget
FROM base AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set production environment for build
ENV NODE_ENV production

# Build the widget
RUN pnpm run build:widget

# Production image, copy all the files and run express server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js .
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/node_modules ./node_modules

USER expressjs

EXPOSE 3001

CMD ["node", "server.js"]