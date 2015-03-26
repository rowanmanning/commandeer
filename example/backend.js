'use strict';

var connect = require('connect');

var app = connect();

app.use(handleRoutes);
app.use(handleErrors);

app.listen(5051, function () {
    console.log('Backend running on port %d', 5051);
});

function handleRoutes (request, response) {
    var routes = {

        '/': function (request, response) {
            response.end([
                '<h1>Example Application</h1>',
                '<ul>',
                    '<li><a href="/text">Plain text</a></li>',
                    '<li><a href="/html">HTML page</a></li>',
                    '<li><a href="/json">Non-proxied JSON</a></li>',
                    '<li><a href="/proxy-json">Proxied JSON</a></li>',
                '</ul>'
            ].join(''));
        },

        '/html': function (request, response) {
            response.end('<p>Hello World!</p>');
        },

        '/text': function (request, response) {
            response.end('Hello World!');
        },

        '/json': function (request, response) {
            response.end('{}');
        },

        '/proxy-json': function (request, response) {
            response.writeHead(200, {
                'Content-Type': 'application/x-commandeer+json'
            });
            response.end('{}');
        },

        '_default': function (request, response) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.end('404');
        }

    };
    (routes[request.url] || routes._default)(request, response);
}

function handleErrors (error, request, response, next) {
    // jshint unused: false
    response.writeHead(500);
    response.end('500');
}
