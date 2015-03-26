'use strict';

var commandeer = require('..');
var connect = require('connect');

var app = connect();

app.use(commandeer({
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    target: 'http://localhost:5051'
}));

app.use(handleProxyData);
app.use(handleErrors);

app.listen(5050, function () {
    console.log('Application running on port %d', 5050);
});

function handleProxyData (request, response, next) {
    if (!response.proxyData) {
        return  next();
    }
    response.proxyData.commandeered = true;
    response.end(JSON.stringify(response.proxyData));
}

function handleErrors (error, request, response, next) {
    // jshint unused: false
    response.writeHead(500);
    response.end('500');
}
