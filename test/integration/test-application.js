'use strict';

const commandeer = require('../..');
const connect = require('connect');

module.exports = createTestApplication;

function createTestApplication (port, backendPort, done) {
    connect()
        .use(commandeer({
            contentType: 'application/x-commandeer-integration+json',
            dataProperty: 'proxyDataIntegration',
            target: `http://localhost:${backendPort}`
        }))
        .use(handleProxyData)
        .use(handleErrors)
        .listen(port, done);
}

function handleProxyData (request, response, next) {
    if (!response.proxyDataIntegration) {
        return next();
    }
    response.proxyDataIntegration.commandeered = true;
    response.end(JSON.stringify(response.proxyDataIntegration));
}

function handleErrors (error, request, response, next) {
    // jshint unused: false
    response.writeHead(500);
    response.end('500');
}
