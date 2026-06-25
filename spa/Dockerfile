FROM ghcr.io/voidzero-dev/vite-plus:1 AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml .node-version ./
RUN vp install --frozen-lockfile
COPY . .
RUN vp build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
