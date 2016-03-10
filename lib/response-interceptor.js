'use strict';

const _ = require('underscore');

module.exports = createResponseInterceptor;

function createResponseInterceptor (response, options) {
    const condition = _.memoize(options.condition);
    const originals = backUpResponseMethods(response);
    ['writeHead', 'write', 'end'].forEach(methodName => {
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
