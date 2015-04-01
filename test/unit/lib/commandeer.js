/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('lib/commandeer', function () {
    var commandeer, http, httpProxy, responseInterceptor, underscore;

    beforeEach(function () {

        http = require('../mock/http');

        httpProxy = require('../mock/http-proxy');
        mockery.registerMock('http-proxy', httpProxy);

        underscore = require('../mock/underscore');
        mockery.registerMock('underscore', underscore);

        responseInterceptor = sinon.spy();
        mockery.registerMock('./response-interceptor', responseInterceptor);

        commandeer = require('../../../lib/commandeer');

    });

    it('should be a function', function () {
        assert.isFunction(commandeer);
    });

    it('should have a `defaults` property', function () {
        assert.isObject(commandeer.defaults);
    });

    describe('.defaults', function () {
        var defaults;

        beforeEach(function () {
            defaults = commandeer.defaults;
        });

        it('should have a `contentType` property', function () {
            assert.strictEqual(defaults.contentType, 'application/x-commandeer+json');
        });

        it('should have a `dataProperty` property', function () {
            assert.strictEqual(defaults.dataProperty, 'proxyData');
        });

        it('should have a `target` property', function () {
            assert.strictEqual(defaults.target, 'http://localhost');
        });

    });

    describe('commandeer()', function () {
        var options, middleware;

        beforeEach(function () {
            options = {
                contentType: 'application/x-commandeer-unit+json',
                dataProperty: 'proxyDataUnit',
                target: 'http://localhost:1234'
            };
            middleware = commandeer(options);
        });

        it('should create a proxy server', function () {
            assert.isTrue(httpProxy.createProxyServer.calledOnce);
        });

        it('should default the options', function () {
            assert.isTrue(underscore.defaults.calledOnce);
            assert.deepEqual(underscore.defaults.firstCall.args[0], {});
            assert.strictEqual(underscore.defaults.firstCall.args[1], options);
            assert.strictEqual(underscore.defaults.firstCall.args[2], commandeer.defaults);
        });

        it('should return a function', function () {
            assert.isFunction(middleware);
        });

        describe('returnedFunction()', function () {
            var proxyServer, request, response, next;

            beforeEach(function () {
                proxyServer = httpProxy.createProxyServer.defaultBehavior.returnValue;
                request = new http.ClientRequest();
                response = new http.ServerResponse();
                next = sinon.spy();
                middleware(request, response, next);
            });

            it('should call `responseInterceptor` with the response', function () {
                assert.isTrue(responseInterceptor.withArgs(response).calledOnce);
            });

            it('should call `proxyServer.web` with the request and response', function () {
                assert.isTrue(proxyServer.web.withArgs(request, response).calledOnce);
            });

            it('should call `proxyServer.web` with a target of `options.target`', function () {
                assert.strictEqual(proxyServer.web.firstCall.args[2].target, options.target);
            });

            describe('responseInterceptor `options.condition`', function () {
                var condition;

                beforeEach(function () {
                    condition = responseInterceptor.firstCall.args[1].condition;
                });

                it('should return `true` if response content-type is `options.contentType`', function () {
                    response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit+json');
                    assert.isTrue(condition());
                    response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit+json; charset=utf-8');
                    assert.isTrue(condition());
                });

                it('should return `false` if response content-type is not `options.contentType`', function () {
                    response.getHeader.withArgs('content-type').returns('text/html');
                    assert.isFalse(condition());
                });

                it('should return `false` if response content-type is not set', function () {
                    assert.isFalse(condition());
                });

                describe('when `options.contentType` is an array', function () {

                    beforeEach(function () {
                        options = {
                            contentType: [
                                'application/x-commandeer-unit1+json',
                                'application/x-commandeer-unit2+json'
                            ],
                            dataProperty: options.dataProperty,
                            target: options.target
                        };
                        middleware = commandeer(options);
                        middleware(request, response, next);
                        condition = responseInterceptor.secondCall.args[1].condition;
                    });

                    it('should return `true` if response content-type is in `options.contentType`', function () {
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit1+json');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit1+json; charset=utf-8');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit2+json');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit2+json; charset=utf-8');
                        assert.isTrue(condition());
                    });

                    it('should return `false` if response content-type is not in `options.contentType`', function () {
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit+json');
                        assert.isFalse(condition());
                        response.getHeader.withArgs('content-type').returns('text/html');
                        assert.isFalse(condition());
                    });

                });

            });

            describe('responseInterceptor `options.writeHead`', function () {
                var writeHead;

                beforeEach(function () {
                    writeHead = responseInterceptor.firstCall.args[1].writeHead;
                });

                it('should set the response status code', function () {
                    writeHead(200);
                    assert.strictEqual(response.statusCode, 200);
                    writeHead(404);
                    assert.strictEqual(response.statusCode, 404);
                });

                it('should remove the response content-type header', function () {
                    writeHead();
                    assert.isTrue(response.removeHeader.withArgs('Content-Type').calledOnce);
                });

                it('should remove the response content-length header', function () {
                    writeHead();
                    assert.isTrue(response.removeHeader.withArgs('Content-Length').calledOnce);
                });

            });

            describe('responseInterceptor `options.end`', function () {
                var end, write;

                beforeEach(function () {
                    end = responseInterceptor.firstCall.args[1].end;
                    write = responseInterceptor.firstCall.args[1].write;
                });

                it('parse the concatenated result of all `write` calls as JSON and add to response under `options.dataProperty`', function () {
                    write(new Buffer('{'));
                    write(new Buffer('"foo": "bar"'));
                    write(new Buffer('}'));
                    end();
                    assert.deepEqual(response.proxyDataUnit, {
                        foo: 'bar'
                    });
                });

                it('should call `next` with no error if the JSON is valid', function () {
                    write(new Buffer('{}'));
                    end();
                    assert.isTrue(next.calledOnce);
                    assert.isUndefined(next.firstCall.args[0]);
                });

                it('call `next` with an error if the JSON is invalid', function () {
                    write(new Buffer('{"foo"}'));
                    end();
                    assert.isUndefined(response.proxyDataUnit);
                    assert.isTrue(next.calledOnce);
                    assert.isInstanceOf(next.firstCall.args[0], Error);
                    assert.strictEqual(next.firstCall.args[0].message, 'Invalid JSON received');
                });

            });

        });

    });

});