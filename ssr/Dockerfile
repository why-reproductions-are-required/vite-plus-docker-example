# syntax=docker/dockerfile:1

# --- build stage: the official Vite+ toolchain image ---
FROM ghcr.io/voidzero-dev/vite-plus:1 AS build
WORKDIR /app

# Install dependencies first so this layer is cached across source changes.
COPY --chown=vp:vp package.json pnpm-lock.yaml ./
RUN vp install --frozen-lockfile

# Build. vp reads .node-version and provisions that exact Node.js automatically.
COPY --chown=vp:vp . .
RUN vp build

# Export the exact resolved Node.js binary for the runtime stage.
RUN cp "$(vp env which node | head -1)" /tmp/node

# --- deps stage: production-only dependencies ---
# A separate, fresh `--prod` install so devDependencies (including the large
# vite-plus toolchain) are excluded. Running `--prod` over the full install in
# the build stage would NOT prune already-installed devDependencies.
FROM ghcr.io/voidzero-dev/vite-plus:1 AS deps
WORKDIR /app
COPY --chown=vp:vp package.json pnpm-lock.yaml ./
RUN vp install --frozen-lockfile --prod

# --- runtime stage: small, glibc, no vp ---
FROM debian:bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# The exact Node.js from .node-version (official, signature-verified build).
COPY --from=build /tmp/node /usr/local/bin/node

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

USER nobody
EXPOSE 3000
CMD ["node", "dist/server.js"]
