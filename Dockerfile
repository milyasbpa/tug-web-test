# =============================================================================
# Multi-stage Dockerfile for Next.js (App Router, standalone output)
#
# Stages:
#   1. deps    — install production + dev dependencies
#   2. builder — run next build (produces .next/standalone)
#   3. runner  — minimal production image (~150MB vs ~500MB without standalone)
#
# Usage:
#   docker build -t my-app .
#   docker run -p 3000:3000 \
#     -e NEXT_PUBLIC_API_URL=https://api.example.com \
#     -e NEXT_PUBLIC_APP_ENV=production \
#     my-app
#
# Notes:
#   - All NEXT_PUBLIC_* vars must be set at BUILD TIME (baked into JS bundle).
#     Pass them as --build-arg ARG_NAME=value and expose as ENV in the builder stage.
#   - Server-only vars (no NEXT_PUBLIC_ prefix) can be passed at RUNTIME via -e.
#   - next.config.ts must have output: 'standalone' (already set).
# =============================================================================

ARG NODE_VERSION=22

# =============================================================================
# Stage 1: deps — install all dependencies
# =============================================================================
FROM node:${NODE_VERSION}-alpine AS deps

# Install libc compatibility shim for Alpine (required by some native addons)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy lockfile + manifests only — Docker layer cache reused if deps unchanged
COPY package.json package-lock.json ./

# Install production + dev deps (dev deps needed for build step)
RUN npm ci --frozen-lockfile

# =============================================================================
# Stage 2: builder — compile and build the Next.js app
# =============================================================================
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy full source
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# -----------------------------------------------------------------------
# Build-time environment variables (NEXT_PUBLIC_* baked into JS bundle)
# Override via: docker build --build-arg NEXT_PUBLIC_API_URL=https://...
# -----------------------------------------------------------------------
ARG NEXT_PUBLIC_API_URL=http://localhost
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

RUN npm run build

# =============================================================================
# Stage 3: runner — minimal production image
# =============================================================================
FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Default port — override via -e PORT=8080
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy public assets (not included in standalone output)
COPY --from=builder /app/public ./public

# Copy standalone build output (server.js + minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets (CSS, JS chunks, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# next.config.ts output: 'standalone' generates server.js at the root of .next/standalone
CMD ["node", "server.js"]
