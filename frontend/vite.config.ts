import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    envDir: path.resolve(__dirname, '..'),
    server: {
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
      historyApiFallback: true,
      // /api is served locally by `vercel dev --listen 3001` (see root package.json's "dev" script)
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && !('headersSent' in res && res.headersSent)) {
                try {
                  res.writeHead(502, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Backend API is not running locally on port 3001' }));
                } catch (_) {}
              }
            });
          },
        }
      }
    },

    publicDir: 'public',
    preview: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && !('headersSent' in res && res.headersSent)) {
                try {
                  res.writeHead(502, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Backend API is not running locally on port 3001' }));
                } catch (_) {}
              }
            });
          },
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    build: {
      outDir: 'build',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          resume: path.resolve(__dirname, 'resume.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          howsqlactuallyworks: path.resolve(__dirname, 'howsqlactuallyworks.html')
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react', 'react-snowfall', 'react-github-calendar']
          }
        }
      }
    }
  };
});
