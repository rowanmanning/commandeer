'use strict';

var _ = require('underscore');
var createProxyServer = require('http-proxy').createProxyServer;
var createResponseInterceptor = require('./response-interceptor');

module.exports = commandeer;
module.exports.defaults = {
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    target: 'http://localhost'
};

function commandeer (options) {
    var proxy = createProxyServer();
    options = defaultOptions(options);
    return function (request, response, next) {
        var jsonData = '';
        createResponseInterceptor(response, {

            condition: function () {
                return responseHasContentType(response, options.contentType);
            },

            writeHead: function (statusCode) {
                response.statusCode = statusCode;
                response.setHeader('Content-Type', 'application/json');
                response.removeHeader('Content-Length');
            },

            write: function (data) {
                jsonData += data.toString();
            },

            end: function () {
                try {
                    response[options.dataProperty] = JSON.parse(jsonData);
                } catch (error) {
                    return next(new Error('Invalid JSON received'));
                }
                next();
            }

        });

        proxy.web(request, response, {
            target: options.target
        });
    };
}

function responseHasContentType (response, expectedContentType) {
    var contentType = response.getHeader('content-type');
    return !!(contentType && contentType.indexOf(expectedContentType) === 0);
}

function defaultOptions (options) {
    return _.defaults({}, options, commandeer.defaults);
}
