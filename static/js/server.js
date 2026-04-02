const express = require('express');
const path = require('path');
const fs = require('fs');
const proxy = require('express-http-proxy');
const app = express();
const port = process.env.PORT || 3000;
const BACKEND_URL = 'http://180.235.121.253:8162';

// Path adjustment: This file is in ./static/js, so root is two levels up
const PROJECT_ROOT = path.join(__dirname, '..', '..');

// 1. Proxy static uploads to the live backend server
app.use('/static/uploads', proxy(BACKEND_URL, {
    proxyReqPathResolver: (req) => `/static/uploads${req.url}`
}));

// 2. Serve local static assets (compiled CSS, JS)
app.use('/static', express.static(path.join(PROJECT_ROOT, 'static')));

// 3. Define routes mapping to HTML templates
const routes = {
    '/': 'home.html',
    '/dashboard': 'home.html',
    '/login': 'login.html',
    '/signup': 'signup.html',
    '/forgot-password': 'forgot_password.html',
    '/reset-password': 'reset_password.html',
    '/profile': 'profile.html',
    '/history': 'history.html',
    '/matches': 'matches.html',
    '/post': 'post.html',
    '/auth-choice': 'auth_choice.html',
    '/splash': 'splash.html',
    '/make-offer': 'make_offer.html'
};

// Standard routes
Object.entries(routes).forEach(([route, template]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(PROJECT_ROOT, 'templates', template));
    });
});

// Dynamic routes
app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(PROJECT_ROOT, 'templates', 'product_details.html'));
});

// Fallback for any other .html files or pages
app.get('/:page', (req, res, next) => {
    const filePath = path.join(PROJECT_ROOT, 'templates', `${req.params.page}.html`);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        next();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`\x1b[32m✔ LocalBridge Dev Server running at http://localhost:${port}\x1b[0m`);
    console.log(`\x1b[36mℹ Serving templates from: ${path.join(PROJECT_ROOT, 'templates')}\x1b[0m`);
    console.log(`\x1b[36mℹ Proxying /static/uploads to ${BACKEND_URL}\x1b[0m`);
});
