// jscs:disable maximumLineLength
'use strict';

const mockery = require('mockery');

beforeEach(() => {
    mockery.enable({
        useCleanCache: true,
        warnOnUnregistered: false,
        warnOnReplace: false
    });
});

afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
});
