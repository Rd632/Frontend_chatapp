import { defineConfig } from 'vite'
import tailwindcssVite from "@tailwindcss/vite"; // ❌ REMOVE



import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcssVite(),react()],
  server: {
		port: 3000,
    proxy: {
			"/api": {
				target: "http://localhost:5000/",
			},
		},
  },
})


