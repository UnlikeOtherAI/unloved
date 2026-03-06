import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 6201,
    proxy: {
      '/api': {
        target: 'http://localhost:6200',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:6200',
        ws: true,
      },
    },
  },
})
