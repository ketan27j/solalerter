import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/dist/clientApp', // Change this to your desired output directory
    // outDir: '../dist/clientApp', // Change this to your desired output directory
    emptyOutDir: true, // Optional: Clean the directory before building
  },
  define: {
    'process.env': {}
  }
})
