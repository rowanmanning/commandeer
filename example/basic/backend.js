'use strict';

var connect = require('connect');

var app = connect();

// Handle application routes
app.use(function (request, response) {
    var routes = {

        // Index route
        '/': function (request, response) {
            response.end([
                '<h1>Example Application</h1>',
                '<ul>',
                    '<li><a href="/text">Plain text</a></li>',
                    '<li><a href="/html">HTML page</a></li>',
                    '<li><a href="/json">Regular JSON</a></li>',
                    '<li><a href="/json-commandeer">JSON which will be commandeered</a></li>',
                '</ul>'
            ].join(''));
        },

        // HTML page
        '/html': function (request, response) {
            response.end('<p>Hello World!</p>');
        },

        // Plain text
        '/text': function (request, response) {
            response.end('Hello World!');
        },

        // Regular JSON
        '/json': function (request, response) {
            response.end('{}');
        },

        // JSON which will be commandeered
        '/json-commandeer': function (request, response) {
            response.writeHead(200, {
                'Content-Type': 'application/x-commandeer+json'
            });
            response.end('{}');
        },

        // 404 page
        '_default': function (request, response) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.end('404');
        }

    };
    (routes[request.url] || routes._default)(request, response);
});

// Handle errors
app.use(function (error, request, response, next) {
    // jshint unused: false
    response.writeHead(500);
    response.end('500');
});

// Start the application
app.listen(3001, function () {
    console.log('Backend running on port %d', 3001);
});
