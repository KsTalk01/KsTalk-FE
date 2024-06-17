import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig({
  base:'/ksfe/',
  plugins: [react()],
  build: {
    outDir: 'dist',  // 输出目录
  },
  root: '.',  // 项目根目录
  server:{
    proxy:{
      '/api1': {
        target: 'http://109.206.247.99:18433/kst',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api1/, ''),
      },
      '/api2': {
        target: 'http://109.206.247.99:8990',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api2/, ''),
      },
    }
  },
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "src"), 
    }
  }
})
