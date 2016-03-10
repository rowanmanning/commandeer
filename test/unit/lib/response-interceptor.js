// jscs:disable maximumLineLength
'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

describe('lib/response-interceptor', () => {
    let http;
    let responseInterceptor;
    let underscore;

    beforeEach(() => {

        http = require('../mock/http');

        underscore = require('../mock/underscore');
        mockery.registerMock('underscore', underscore);

        responseInterceptor = require('../../../lib/response-interceptor');

    });

    it('should be a function', () => {
        assert.isFunction(responseInterceptor);
    });

    describe('responseInterceptor()', () => {
        let options;
        let response;
        let responseBackup;

        beforeEach(() => {
            response = new http.ServerResponse();
            responseBackup = {
                write: response.write,
                writeHead: response.writeHead,
                end: response.end
            };
            options = {
                condition: sinon.stub(),
                write: sinon.spy(),
                writeHead: sinon.spy(),
                end: sinon.spy()
            };
            responseInterceptor(response, options);
        });

        it('should replace the `response.write` method', () => {
            assert.notStrictEqual(response.write, responseBackup.write);
        });

        it('should replace the `response.writeHead` method', () => {
            assert.notStrictEqual(response.writeHead, responseBackup.writeHead);
        });

        it('should replace the `response.end` method', () => {
            assert.notStrictEqual(response.end, responseBackup.end);
        });

        it('should memoize `options.condition`', () => {
            assert.isTrue(underscore.memoize.withArgs(options.condition).calledOnce);
        });

        describe('when `options.condition` returns `false`', () => {

            beforeEach(() => {
                options.condition.returns(false);
            });

            it('should call the original `response.write`', () => {
                response.write('foo', 'bar');
                assert.isTrue(responseBackup.write.withArgs('foo', 'bar').calledOnce, 'Called once');
                assert.isTrue(responseBackup.write.withArgs('foo', 'bar').calledOn(response), 'Called with `response` as `this`');
                assert.notStrictEqual(response.write, responseBackup.write, 'Orignal method not restored');
            });

            it('should call the original `response.writeHead`', () => {
                response.writeHead('foo', 'bar');
                assert.isTrue(responseBackup.writeHead.withArgs('foo', 'bar').calledOnce, 'Called once');
                assert.isTrue(responseBackup.writeHead.withArgs('foo', 'bar').calledOn(response), 'Called with `response` as `this`');
                assert.notStrictEqual(response.writeHead, responseBackup.writeHead, 'Orignal method not restored');
            });

            it('should restore the original methods and call the original `response.end`', () => {
                response.end('foo', 'bar');
                assert.isTrue(responseBackup.end.withArgs('foo', 'bar').calledOnce, 'Called once');
                assert.isTrue(responseBackup.end.withArgs('foo', 'bar').calledOn(response), 'Called with `response` as `this`');
                assert.strictEqual(response.write, responseBackup.write, 'Orignal methods are restored');
                assert.strictEqual(response.writeHead, responseBackup.writeHead, 'Orignal methods are restored');
                assert.strictEqual(response.end, responseBackup.end, 'Orignal methods are restored');
            });

        });

        describe('when `options.condition` returns `true`', () => {

            beforeEach(() => {
                options.condition.returns(true);
            });

            it('should call `options.write`', () => {
                response.write('foo', 'bar');
                assert.isTrue(options.write.withArgs('foo', 'bar').calledOnce, 'Called once');
                assert.isTrue(options.write.withArgs('foo', 'bar').calledOn(response), 'Called with `response` as `this`');
                assert.notStrictEqual(response.write, responseBackup.write, 'Orignal method not restored');
            });

            it('should call `options.writeHead`', () => {
                response.writeHead('foo', 'bar');
                assert.isTrue(options.writeHead.withArgs('foo', 'bar').calledOnce, 'Called once');
                assert.isTrue(options.writeHead.withArgs('foo', 'bar').calledOn(response), 'Called with `response` as `this`');
                assert.notStrictEqual(response.writeHead, responseBackup.writeHead, 'Orignal method not restored');
            });

            it('should restore the original methods and call `options.end`', () => {
                response.end('foo', 'bar');
                assert.isTrue(options.end.withArgs('foo', 'bar').calledOnce, 'Called once');
                assert.isTrue(options.end.withArgs('foo', 'bar').calledOn(response), 'Called with `response` as `this`');
                assert.strictEqual(response.write, responseBackup.write, 'Orignal methods are restored');
                assert.strictEqual(response.writeHead, responseBackup.writeHead, 'Orignal methods are restored');
                assert.strictEqual(response.end, responseBackup.end, 'Orignal methods are restored');
            });

        });

    });

});
