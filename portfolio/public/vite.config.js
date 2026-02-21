import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
                playground: resolve(__dirname, 'playground.html'),
                projects: resolve(__dirname, 'projects.html') // <-- ADDED THIS LINE
            }
        }
    }
})