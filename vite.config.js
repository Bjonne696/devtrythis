import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: ['all', '85432cff-5bb4-4d70-847f-821f1b2a7707.spock.prod.repl.run', '38891101-0b98-4d1c-a4dc-d56b3757b81e-00-2jy3vo3frlgct.spock.replit.dev', 'bergehyttene.replit.app'],
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: ['bergehyttene.replit.app']
  }
})
