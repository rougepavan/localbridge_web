import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

// Collect all HTML templates as multi-page entry points
const templateDir = path.resolve(__dirname, 'templates');
const htmlEntries = Object.fromEntries(
  fs.readdirSync(templateDir)
    .filter(f => f.endsWith('.html'))
    .map(f => [
      f.replace('.html', ''),
      path.resolve(templateDir, f)
    ])
);

export default defineConfig({
  server: {
    // CHANGE THIS PORT NUMBER TO WHATEVER PORT YOU WANT
    port: 3000, 
    proxy: {
      '/static/uploads': {
        target: 'http://192.168.31.156:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: htmlEntries
    }
  },
  plugins: [
    {
      name: 'localbridge-routing-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
            const routes = {
                '/': '/templates/splash.html',
                '/dashboard': '/templates/home.html',
                '/login': '/templates/login.html',
                '/signup': '/templates/signup.html',
                '/forgot-password': '/templates/forgot_password.html',
                '/reset-password': '/templates/reset_password.html',
                '/profile': '/templates/profile.html',
                '/history': '/templates/history.html',
                '/matches': '/templates/matches.html',
                '/post': '/templates/post.html',
                '/auth-choice': '/templates/auth_choice.html',
                '/splash': '/templates/splash.html',
                '/make-offer': '/templates/make_offer.html'
            };
            
            // Separate pure path from query params logic
            const urlWithoutQuery = req.url.split('?')[0];

            if (routes[urlWithoutQuery]) {
                req.url = routes[urlWithoutQuery] + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
            } else if (urlWithoutQuery.startsWith('/product/')) {
                req.url = '/templates/product_details.html';
            } else if (urlWithoutQuery && !urlWithoutQuery.includes('.') && urlWithoutQuery !== '/') {
                // If it's a generic clean route, try checking if standard HTML file exists
                const possiblePath = path.join(__dirname, 'templates', `${urlWithoutQuery}.html`);
                if (fs.existsSync(possiblePath)) {
                    req.url = `/templates${urlWithoutQuery}.html`;
                }
            }
            next();
        });
      }
    }
  ]
});
