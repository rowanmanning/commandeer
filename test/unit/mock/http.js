'use strict';

var sinon = require('sinon');

module.exports = {
    ClientRequest: sinon.stub().returns({}),
    ServerResponse: sinon.stub().returns({
        statusCode: null,
        writeHead: sinon.stub(),
        write: sinon.stub(),
        end: sinon.stub(),
        getHeader: sinon.stub(),
        setHeader: sinon.stub(),
        removeHeader: sinon.stub()
    })
};
