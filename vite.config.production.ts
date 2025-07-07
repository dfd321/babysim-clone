import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // Production optimizations
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      cssMinify: true,
      
      // Code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for third-party dependencies
            vendor: ['react', 'react-dom'],
            // UI components chunk
            ui: ['lucide-react'],
            // Scenario chunks for age-based loading
            'scenarios-early': ['./src/scenarios/earlyChildhood.ts'],
            'scenarios-middle': ['./src/scenarios/middleChildhood.ts'],
            'scenarios-preteen': ['./src/scenarios/preTeens.ts'],
            'scenarios-teen': ['./src/scenarios/teenagers.ts'],
            // Core game services
            'game-core': ['./src/services/dynamicScenarioLoader.ts'],
            // Testing utilities (only in dev builds)
            ...(mode !== 'production' && {
              testing: ['@testing-library/react', '@testing-library/jest-dom']
            })
          },
          // Asset naming for better caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name?.split('.').at(-1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/css/i.test(extType ?? '')) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      },
      
      // Terser options for maximum compression
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
          passes: 2
        },
        mangle: {
          safari10: true
        },
        format: {
          comments: false
        }
      },
      
      // Bundle size limits
      chunkSizeWarningLimit: 1000,
    },
    
    // Optimization
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react'],
      exclude: ['@testing-library/react', '@testing-library/jest-dom']
    },
    
    // Define environment variables
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // Security headers
    server: {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
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