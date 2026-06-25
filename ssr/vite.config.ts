import { defineConfig } from 'vite-plus'

export default defineConfig({
  build: {
    ssr: 'src/server.ts',
    outDir: 'dist',
    rollupOptions: {
      output: { entryFileNames: 'server.js' },
    },
  },
})
