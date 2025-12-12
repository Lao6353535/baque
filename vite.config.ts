import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // 修改这里：从 './' 改为 '/'，适配 Vercel 网页环境
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})