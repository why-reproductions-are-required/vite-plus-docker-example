import { createServer } from 'node:http'

const port = Number(process.env.PORT) || 3000

createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' })
  res.end('vite-plus docker SSR example OK\n')
}).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on http://0.0.0.0:${port}`)
})
