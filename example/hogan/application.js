'use strict';

var commandeer = require('../..');
var connect = require('connect');
var fs = require('fs');
var hogan = require('hogan.js');

var app = connect();

// Compile templates
var templates = {
    about: loadTemplate('about'),
    error: loadTemplate('error'),
    home: loadTemplate('home')
};

// Load a template
function loadTemplate (name) {
    return hogan.compile(fs.readFileSync(__dirname + '/view/' + name + '.mustache', 'utf-8'));
}

// Initialise Commandeer
app.use(commandeer({
    dataProperty: 'viewData',
    target: 'http://localhost:3001'
}));

// Handle responses with proxy data
// (Render the requested template)
app.use(function (request, response) {
    var template = templates[response.viewData.template];
    var output = template.render(response.viewData);
    response.end(output);
});

// Handle errors
// (Render the error page)
app.use(function (error, request, response, next) {
    // jshint unused: false
    response.writeHead(500);
    response.end(templates.error.render({
        template: 'error',
        type: 500
    }));
});

// Start the application
app.listen(3000, function () {
    console.log('Application running on port %d', 3000);
});
