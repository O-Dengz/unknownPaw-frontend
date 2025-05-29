// // vite.config.ts
// import {defineConfig} from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//         secure: false,
//         rewrite: path => path.replace(/^\/api/, '')
//       }
//     }
//   },
//   plugins: [react(), tailwindcss()],
//   css: {
//     devSourcemap: false
//   }
// })
// vite.config.ts
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 🌟🌟🌟 '/api'로 시작하는 요청을 '/unknownPaw/api'로 리다이렉트합니다! 🌟🌟🌟
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true, // Cross-Origin 문제 해결
        // rewrite 함수를 사용하여 프론트엔드에서 '/api'로 보낸 요청을
        // 백엔드에서 '/unknownPaw/api'로 받도록 경로를 재작성합니다.
        rewrite: path => `/unknownPaw${path}`, // 예: /api/posts -> /unknownPaw/api/posts
        secure: false // 개발 환경에서는 https 문제가 발생할 수 있으므로 false로 설정
      }
    }
  }
})
