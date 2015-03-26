/* jshint maxstatements: false, maxlen: false */
/* global before */
'use strict';

var createTestApplication = require('./test-application');
var createTestBackend = require('./test-backend');
var request = require('request');

before(function (done) {
    var self = this;

    var applicationPort = process.env.PORT || 5052;
    var backendPort = process.env.BACKEND_PORT || 5053;

    self.request = function (method, path, headers, done) {
        request({
            method: method.toUpperCase(),
            url: 'http://localhost:' + applicationPort + path,
            headers: headers,
            json: true
        }, function (error, response, body) {
            self.response = response;
            self.body = body;
            done(error);
        });
    };

    createTestApplication(applicationPort, backendPort, function () {
        createTestBackend(backendPort, function () {
            done();
        });
    });
});
