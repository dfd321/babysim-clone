import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // Staging optimizations (less aggressive for debugging)
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true, // Keep sourcemaps for debugging
      minify: 'esbuild', // Faster build times
      cssMinify: true,
      
      // Basic code splitting
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react'],
            testing: ['@testing-library/react', '@testing-library/jest-dom']
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      },
      
      // Less aggressive compression for faster builds
      chunkSizeWarningLimit: 1500,
    },
    
    // Development-friendly optimization
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react', '@testing-library/react'],
    },
    
    // Define environment variables
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEBUG__: JSON.stringify(env.VITE_ENABLE_DEBUG === 'true'),
    },
    
    // Development server configuration
    server: {
      port: 3000,
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
      }
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@types': resolve(__dirname, './src/types'),
        '@utils': resolve(__dirname, './src/utils'),
        '@services': resolve(__dirname, './src/services'),
        '@contexts': resolve(__dirname, './src/contexts'),
      }
    }
  };
});