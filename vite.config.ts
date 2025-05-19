import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/uploadAjax': {
        target: 'http://localhost:8080/unknownPaw/api/',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:8080/unknownPaw',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react(), tailwindcss()]
})
