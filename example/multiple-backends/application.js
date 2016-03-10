'use strict';

const commandeer = require('../..');
const connect = require('connect');

const app = connect();

// Initialise Commandeer with `target` set to a function
app.use(commandeer({
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    target: resolveTarget
}));

// Resolve target function, used to decide which backend
// to proxy to
function resolveTarget (request) {
    if (/^\/backend2(\/|$)/.test(request.url)) {
        // proxy to backend2
        return 'http://localhost:3002';
    }
    // proxy to backend 1
    return 'http://localhost:3001';
}

// Handle responses with proxy data
// (Just add another property to the JSON and output it)
app.use((request, response) => {
    response.proxyData.commandeered = true;
    response.end(JSON.stringify(response.proxyData));
});

// Handle errors
app.use((error, request, response, next) => {
    // jshint unused: false
    response.writeHead(500);
    response.end('500');
});

// Start the application
app.listen(3000, () => {
    console.log('Application running on port %d', 3000);
});
