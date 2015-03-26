'use strict';

var _ = require('underscore');

module.exports = createResponseInterceptor;

function createResponseInterceptor (response, options) {
    var condition = _.memoize(options.condition);
    var originals = backUpResponseMethods(response);
    ['writeHead', 'write', 'end'].forEach(function (methodName) {
        response[methodName] = function () {
            if (methodName === 'end') {
                restoreResponseMethods(response, originals);
            }
            (condition() ? options : originals)[methodName].apply(response, arguments);
        };
    });
}

function backUpResponseMethods (response) {
    return {
        end: response.end,
        write: response.write,
        writeHead: response.writeHead
    };
}

function restoreResponseMethods (response, originals) {
    response.end = originals.end;
    response.write = originals.write;
    response.writeHead = originals.writeHead;
}
