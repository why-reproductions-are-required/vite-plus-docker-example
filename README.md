# vite-plus-docker-example

Runnable reproductions of the Docker examples in the Vite+ docs
([`docs/guide/docker.md`](https://github.com/voidzero-dev/vite-plus/blob/main/docs/guide/docker.md)),
verified end to end in GitHub Actions.

Each example uses the documented multi-stage pattern: the official Vite+
toolchain image builds the app, and the exact Node.js resolved from
`.node-version` is used at runtime.

## Examples

- [`ssr/`](./ssr) — Node-server (SSR) app. The build stage runs `vp build`, then
  the **exact** Node.js binary from `.node-version` is copied into a slim
  `debian:bookworm-slim` runtime stage that runs `node dist/server.js`. No `vp`
  in the runtime image.
- [`spa/`](./spa) — static SPA. The build stage runs `vp build`; the output is
  served by `nginx:alpine`. No Node.js at runtime.

The `Dockerfile` in each directory is copied verbatim from the Vite+ docs.

## How it is verified

[`.github/workflows/verify.yml`](./.github/workflows/verify.yml) on every push:

1. Builds the Vite+ toolchain image and tags it `ghcr.io/voidzero-dev/vite-plus:1`
   (the tag the docs use). See the note below.
2. Builds each example image.
3. Runs each container and asserts `HTTP 200`, plus, for SSR, that the runtime
   Node.js version equals the pinned `.node-version` (`24.15.0`).

### Note on the base image

The official `ghcr.io/voidzero-dev/vite-plus` image is not published yet, so the
workflow builds it locally from [`base.Dockerfile`](./base.Dockerfile), which
mirrors `docker/Dockerfile` in the Vite+ repo (it installs `vp` via the official
install script). Once the image is published to GHCR, the build-base step can be
replaced with `docker pull ghcr.io/voidzero-dev/vite-plus:1`.

## Run locally

```bash
# Build the toolchain base image the examples reference
docker build -f base.Dockerfile -t ghcr.io/voidzero-dev/vite-plus:1 .

# SSR
docker build -t vp-ssr ./ssr
docker run --rm -p 3000:3000 vp-ssr
# -> http://localhost:3000  ("vite-plus docker SSR example OK")

# SPA
docker build -t vp-spa ./spa
docker run --rm -p 8080:80 vp-spa
# -> http://localhost:8080
```
