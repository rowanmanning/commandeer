'use strict';

var _ = require('underscore');
var sinon = require('sinon');

module.exports = {
    defaults: sinon.stub().returnsArg(1),
    memoize: sinon.spy(_.memoize)
};
