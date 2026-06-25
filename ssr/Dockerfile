# syntax=docker/dockerfile:1

# --- build stage: the official Vite+ toolchain image ---
FROM ghcr.io/voidzero-dev/vite-plus:1 AS build
WORKDIR /app

# Install dependencies first so this layer is cached across source changes.
COPY package.json pnpm-lock.yaml .node-version ./
RUN vp install --frozen-lockfile

# Build. vp reads .node-version and provisions that exact Node.js automatically.
COPY . .
RUN vp build

# Stage production-only dependencies and the exact resolved Node.js binary.
RUN vp install --frozen-lockfile --prod \
 && cp "$(vp env which node | head -1)" /tmp/node

# --- runtime stage: small, glibc, no vp ---
FROM debian:bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# The exact Node.js from .node-version (official, signature-verified build).
COPY --from=build /tmp/node /usr/local/bin/node

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

USER nobody
EXPOSE 3000
CMD ["node", "dist/server.js"]
