'use strict';

const connect = require('connect');

const app = connect();

// Application routes
const routes = {

    // Index route
    '/backend2' (request, response) {
        response.end([
            '<h1>Example Backend 2</h1>',
            '<ul>',
                '<li><a href="/">Page served by Backend 1</a></li>',
                '<li><a href="/backend2">Page served by Backend 2</a></li>',
                '<li><a href="/jsonc">Commandeerable JSON served by Backend 1 </a></li>',
                '<li><a href="backend2/jsonc">Commandeerable JSON served by Backend 2</a></li>',
            '</ul>'
        ].join(''));
    },

    // JSON which will be commandeered
    '/backend2/jsonc' (request, response) {
        response.writeHead(200, {
            'Content-Type': 'application/x-commandeer+json'
        });
        response.end('{"backend":2}');
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
app.listen(3002, () => {
    console.log('Backend running on port %d', 3002);
});
