'use strict';

const commandeer = require('../..');
const connect = require('connect');

const app = connect();

// Initialise Commandeer
app.use(commandeer({
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    target: 'http://localhost:3001'
}));

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
