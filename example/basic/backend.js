'use strict';

const connect = require('connect');

const app = connect();

// Application routes
const routes = {

    // Index route
    '/' (request, response) {
        response.end([
            '<h1>Example Application</h1>',
            '<ul>',
                '<li><a href="/text">Plain text</a></li>',
                '<li><a href="/html">HTML page</a></li>',
                '<li><a href="/json">Regular JSON</a></li>',
                '<li><a href="/jsonc">Commandeerable JSON</a></li>',
            '</ul>'
        ].join(''));
    },

    // HTML page
    '/html' (request, response) {
        response.end('<p>Hello World!</p>');
    },

    // Plain text
    '/text' (request, response) {
        response.end('Hello World!');
    },

    // Regular JSON
    '/json' (request, response) {
        response.end('{}');
    },

    // JSON which will be commandeered
    '/jsonc' (request, response) {
        response.writeHead(200, {
            'Content-Type': 'application/x-commandeer+json'
        });
        response.end('{}');
    }

};

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
    response.end('404');
});

// Handle 500 errors
app.use((error, request, response, next) => {
    // jshint unused: false
    response.writeHead(500);
    response.end('500');
});

// Start the application
app.listen(3001, () => {
    console.log('Backend running on port %d', 3001);
});
