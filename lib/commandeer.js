'use strict';

var _ = require('underscore');
var createProxyServer = require('http-proxy').createProxyServer;
var createResponseInterceptor = require('./response-interceptor');
var url = require('url');

module.exports = commandeer;
module.exports.defaults = {
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    rewriteHostHeader: true,
    target: 'http://localhost'
};

function commandeer (options) {
    var proxy = createProxyServer();
    options = defaultOptions(options);
    proxy.on('proxyReq', handleProxyRequest.bind(null, options));
    return function (request, response, next) {
        var jsonData = '';
        createResponseInterceptor(response, {

            condition: function () {
                return responseHasContentType(response, options.contentType);
            },

            writeHead: function (statusCode) {
                response.statusCode = statusCode;
                response.removeHeader('Content-Type');
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

function handleProxyRequest (options, proxyRequest, request, response, proxyOptions) {
    if (options.rewriteHostHeader) {
        proxyRequest.setHeader('Host', url.parse(proxyOptions.target).host);
    }
}

function responseHasContentType (response, expectedContentTypes) {
    var contentType = response.getHeader('content-type');
    if (typeof contentType !== 'string') {
        return false;
    }
    contentType = contentType.split(';')[0].trim().toLowerCase();
    return (expectedContentTypes.indexOf(contentType) !== -1);
}

function defaultOptions (options) {
    options = _.defaults({}, options, commandeer.defaults);
    if (!Array.isArray(options.contentType)) {
        options.contentType = [options.contentType];
    }
    options.contentType.map(lowerCase);
    return options;
}

function lowerCase (string) {
    return string.toLowerCase();
}
