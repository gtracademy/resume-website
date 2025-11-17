import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [tailwindcss(), react()],
    css: {
        preprocessorOptions: {
            scss: {
                // Ensure SASS files are processed correctly
                api: 'modern-compiler',
            },
        },
    },
    resolve: {
        // Add common extensions for better compatibility
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss', '.css'],
    },
    server: {
        host: '127.0.0.1',  // Use IPv4 localhost instead of IPv6
        port: 3000,
        strictPort: false,   // Allow fallback to other ports if 5173 is busy
        // Ensure dev server handles routes properly for SPA
        historyApiFallback: true,
    },
});
