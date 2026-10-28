import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const adminBasePath = env.VITE_ADMIN_BASE_PATH || '/admin'

  return {
    base: `${adminBasePath.replace(/\/+$/, '') || ''}/`,
    plugins: [react(), tailwindcss()],
    server: {
      port: 5174,
      host: "0.0.0.0",
      strictPort: true,
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
  }
})
