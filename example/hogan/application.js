'use strict';

const commandeer = require('../..');
const connect = require('connect');
const fs = require('fs');
const hogan = require('hogan.js');

const app = connect();

// Compile templates
const templates = {
    about: loadTemplate('about'),
    error: loadTemplate('error'),
    home: loadTemplate('home')
};

// Load a template
function loadTemplate (name) {
    return hogan.compile(fs.readFileSync(`${__dirname}/view/${name}.mustache`, 'utf-8'));
}

// Initialise Commandeer
app.use(commandeer({
    dataProperty: 'viewData',
    target: 'http://localhost:3001'
}));

// Handle responses with proxy data
// (Render the requested template)
app.use((request, response) => {
    const template = templates[response.viewData.template];
    const output = template.render(response.viewData);
    response.end(output);
});

// Handle errors
// (Render the error page)
app.use((error, request, response, next) => {
    // jshint unused: false
    response.writeHead(500);
    response.end(templates.error.render({
        template: 'error',
        type: 500
    }));
});

// Start the application
app.listen(3000, () => {
    console.log('Application running on port %d', 3000);
});
