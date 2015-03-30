'use strict';

var commandeer = require('../..');
var connect = require('connect');

var app = connect();

// Initialise Commandeer
app.use(commandeer({
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    target: 'http://localhost:3001'
}));

// Handle responses with proxy data
// (Just add another property to the JSON and output it)
app.use(function (request, response) {
    response.proxyData.commandeered = true;
    response.end(JSON.stringify(response.proxyData));
});

// Handle errors
app.use(function (error, request, response, next) {
    // jshint unused: false
    response.writeHead(500);
    response.end('500');
});

// Start the application
app.listen(3000, function () {
    console.log('Application running on port %d', 3000);
});
