'use strict';

const _ = require('underscore');
const sinon = require('sinon');

module.exports = {
    defaults: sinon.stub().returnsArg(1),
    memoize: sinon.spy(_.memoize)
};
