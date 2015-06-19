'use strict';

var connect = require('connect');

module.exports = createTestBackend;

function createTestBackend (port, done) {
    connect()
        .use(handleRoutes)
        .listen(port, done);
}

var routes = {

    '/text': function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('text');
    },

    '/text-with-status': function (req, res) {
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        });
        res.end('text');
    },

    '/text-with-header': function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'X-Header': 'value'
        });
        res.end('text');
    },

    '/json': function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end('{}');
    },

    '/json-with-status': function (req, res) {
        res.writeHead(400, {
            'Content-Type': 'application/json'
        });
        res.end('{}');
    },

    '/json-with-header': function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Header': 'value'
        });
        res.end('{}');
    },

    '/json-commandeer': function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/x-commandeer-integration+json'
        });
        res.end('{}');
    },

    '/json-commandeer-with-status': function (req, res) {
        res.writeHead(400, {
            'Content-Type': 'application/x-commandeer-integration+json'
        });
        res.end('{}');
    },

    '/json-commandeer-with-header': function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/x-commandeer-integration+json',
            'X-Header': 'value'
        });
        res.end('{}');
    },

    default: function (req, res) {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('404');
    }

};

function handleRoutes (req, res) {
    (routes[req.url] || routes.default)(req, res);
}
