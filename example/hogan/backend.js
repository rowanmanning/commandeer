'use strict';

const connect = require('connect');

const app = connect();

// Application routes
const routes = {

    // Home page
    '/' (request, response) {
        response.end(JSON.stringify({
            template: 'home',
            title: 'Home'
        }));
    },

    // About page
    '/about' (request, response) {
        response.end(JSON.stringify({
            template: 'about',
            title: 'About'
        }));
    }

};

// Set the commandeerable content type for all requests
app.use((request, response, next) => {
    response.setHeader('Content-Type', 'application/x-commandeer+json');
    next();
});

// Handle application routes
app.use((request, response, next) => {
    if (routes[request.url]) {
        return routes[request.url](request, response, next);
    }
    next();
});

// Handle 404 errors
app.use((request, response) => {
    response.writeHead(404);
    response.end(JSON.stringify({
        template: 'error',
        type: 404
    }));
});

// Handle 500 errors
app.use((error, request, response, next) => {
    // jshint unused: false
    response.writeHead(500);
    response.end(JSON.stringify({
        template: 'error',
        type: 500
    }));
});

// Start the application
app.listen(3001, () => {
    console.log('Backend running on port %d', 3001);
});
