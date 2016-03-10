// jscs:disable maximumLineLength, requireArrowFunctions
'use strict';

const createTestApplication = require('./test-application');
const createTestBackend = require('./test-backend');
const request = require('request');

before(function (done) {
    const self = this;

    const applicationPort = process.env.PORT || 5052;
    const backendPort = process.env.BACKEND_PORT || 5053;

    self.request = (method, path, headers, done) => {
        request({
            method: method.toUpperCase(),
            url: `http://localhost:${applicationPort}${path}`,
            headers: headers,
            json: true
        }, (error, response, body) => {
            self.response = response;
            self.body = body;
            done(error);
        });
    };

    createTestApplication(applicationPort, backendPort, () => {
        createTestBackend(backendPort, () => {
            done();
        });
    });
});
