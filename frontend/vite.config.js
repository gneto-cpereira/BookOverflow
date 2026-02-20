import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: ['.trycloudflare.com', 'frontend'],
    host: true, 
    port: 5173
  }
})