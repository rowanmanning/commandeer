'use strict';

const connect = require('connect');

module.exports = createTestBackend;

function createTestBackend (port, done) {
    connect()
        .use(handleRoutes)
        .listen(port, done);
}

const routes = {

    '/text' (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('text');
    },

    '/text-with-status' (req, res) {
        res.writeHead(400, {
            'Content-Type': 'text/plain'
        });
        res.end('text');
    },

    '/text-with-header' (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'X-Header': 'value'
        });
        res.end('text');
    },

    '/json' (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end('{}');
    },

    '/json-with-status' (req, res) {
        res.writeHead(400, {
            'Content-Type': 'application/json'
        });
        res.end('{}');
    },

    '/json-with-header' (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Header': 'value'
        });
        res.end('{}');
    },

    '/json-commandeer' (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/x-commandeer-integration+json'
        });
        res.end('{}');
    },

    '/json-commandeer-with-status' (req, res) {
        res.writeHead(400, {
            'Content-Type': 'application/x-commandeer-integration+json'
        });
        res.end('{}');
    },

    '/json-commandeer-with-header' (req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/x-commandeer-integration+json',
            'X-Header': 'value'
        });
        res.end('{}');
    },

    default (req, res) {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.end('404');
    }

};

function handleRoutes (req, res) {
    (routes[req.url] || routes.default)(req, res);
}
