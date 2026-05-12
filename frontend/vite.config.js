import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // No proxy needed — API URL is set explicitly via VITE_API_URL in .env
  }
})
