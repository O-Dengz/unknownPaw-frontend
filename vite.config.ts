import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'    

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {alias: {'@': path.resolve(__dirname, 'src')}},
  server: {
    proxy: {
      // 기존 API
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api/, '/unknownPaw/api')
      },
      // 새로 추가: 정적 업로드 폴더
      '/unknownPaw': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: p => p // 그대로 보냄
      }
    }
  },
  css: {devSourcemap: false}
})