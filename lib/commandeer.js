'use strict';

const _ = require('underscore');
const createProxyServer = require('http-proxy').createProxyServer;
const createResponseInterceptor = require('./response-interceptor');
const parseUrl = require('url').parse;

module.exports = commandeer;
module.exports.defaults = {
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    log: {
        error: /* istanbul ignore next */ () => {},
        info: /* istanbul ignore next */ () => {}
    },
    rewriteHostHeader: true,
    target: 'http://localhost'
};

function commandeer (options) {
    const proxy = createProxyServer();
    options = defaultOptions(options);
    proxy.on('proxyReq', handleProxyRequest.bind(null, options));
    proxy.on('proxyRes', handleProxyResponse.bind(null, options));

    return (request, response, next) => {
        let jsonData = '';

        createResponseInterceptor(response, {

            condition () {
                return responseHasContentType(response, options.contentType);
            },

            writeHead (statusCode) {
                response.statusCode = statusCode;
                response.removeHeader('Content-Type');
                response.removeHeader('Content-Length');
            },

            write (data) {
                jsonData += data.toString();
            },

            end () {
                try {
                    response[options.dataProperty] = JSON.parse(jsonData);
                } catch (error) {
                    return next(new Error('Invalid JSON received'));
                }
                next();
            }

        });

        const target = resolveTarget(options.target, request);
        const targetUrl = target.replace(/\/+$/, '') + request.url;
        options.log.info(`Proxying "${request.url}" to "${targetUrl}"`);

        proxy.web(request, response, {
            target: target
        }, error => {
            options.log.error(`Failed to proxy "${request.url}"`);
            next(error);
        });
    };
}

function handleProxyRequest (options, proxyRequest, request, response, proxyOptions) {
    if (options.rewriteHostHeader) {
        proxyRequest.setHeader('Host', parseUrl(proxyOptions.target).host);
    }
}

function handleProxyResponse (options, proxyResponse, request) {
    options.log.info(`Proxied "${request.url}" successfully`);
}

function responseHasContentType (response, expectedContentTypes) {
    let contentType = response.getHeader('content-type');
    if (typeof contentType !== 'string') {
        return false;
    }
    contentType = contentType.split(';')[0].trim().toLowerCase();
    return (expectedContentTypes.indexOf(contentType) !== -1);
}

function resolveTarget (target, request) {
    return (typeof target === 'function' ? target(request) : target);
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
