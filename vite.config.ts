import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      // rewrite: path => path.replace(/^\/api/, '')  // << 이 줄을 지우거나 주석처리
    }
  }
},
  plugins: [react(), tailwindcss()]
})
