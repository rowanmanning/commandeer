// jscs:disable maximumLineLength
'use strict';

const assert = require('proclaim');
const mockery = require('mockery');
const sinon = require('sinon');

describe('lib/commandeer', () => {
    let commandeer;
    let http;
    let httpProxy;
    let responseInterceptor;
    let underscore;

    beforeEach(() => {

        http = require('../mock/http');

        httpProxy = require('../mock/http-proxy');
        mockery.registerMock('http-proxy', httpProxy);

        underscore = require('../mock/underscore');
        mockery.registerMock('underscore', underscore);

        responseInterceptor = sinon.spy();
        mockery.registerMock('./response-interceptor', responseInterceptor);

        commandeer = require('../../../lib/commandeer');

    });

    it('should be a function', () => {
        assert.isFunction(commandeer);
    });

    it('should have a `defaults` property', () => {
        assert.isObject(commandeer.defaults);
    });

    describe('.defaults', () => {
        let defaults;

        beforeEach(() => {
            defaults = commandeer.defaults;
        });

        it('should have a `contentType` property', () => {
            assert.strictEqual(defaults.contentType, 'application/x-commandeer+json');
        });

        it('should have a `dataProperty` property', () => {
            assert.strictEqual(defaults.dataProperty, 'proxyData');
        });

        it('should have a `log` property', () => {
            assert.isObject(defaults.log);
        });

        it('should have a `log.error` method', () => {
            assert.isFunction(defaults.log.error);
        });

        it('should have a `log.info` method', () => {
            assert.isFunction(defaults.log.info);
        });

        it('should have a `rewriteHostHeader` property', () => {
            assert.isTrue(defaults.rewriteHostHeader);
        });

        it('should have a `target` property', () => {
            assert.strictEqual(defaults.target, 'http://localhost');
        });

    });

    describe('commandeer()', () => {
        let middleware;
        let options;
        let proxyServer;

        beforeEach(() => {
            options = {
                contentType: 'application/x-commandeer-unit+json',
                dataProperty: 'proxyDataUnit',
                log: {
                    error: sinon.spy(),
                    info: sinon.spy()
                },
                rewriteHostHeader: true,
                target: 'http://localhost:1234'
            };
            middleware = commandeer(options);
            proxyServer = httpProxy.createProxyServer.defaultBehavior.returnValue;
        });

        it('should default the options', () => {
            assert.isTrue(underscore.defaults.calledOnce);
            assert.deepEqual(underscore.defaults.firstCall.args[0], {});
            assert.strictEqual(underscore.defaults.firstCall.args[1], options);
            assert.strictEqual(underscore.defaults.firstCall.args[2], commandeer.defaults);
        });

        it('should create a proxy server', () => {
            assert.isTrue(httpProxy.createProxyServer.calledOnce);
        });

        it('should handle the proxy server "proxyReq" event', () => {
            assert.isTrue(proxyServer.on.withArgs('proxyReq').calledOnce);
            assert.isFunction(proxyServer.on.withArgs('proxyReq').firstCall.args[1]);
        });

        describe('proxy server "proxyReq" handler', () => {
            let proxyOptions;
            let proxyReqHandler;
            let proxyRequest;

            beforeEach(() => {
                proxyOptions = {
                    target: 'http://localhost:1234'
                };
                proxyRequest = new http.ClientRequest();
                proxyReqHandler = proxyServer.on.withArgs('proxyReq').firstCall.args[1];
                proxyReqHandler(proxyRequest, {}, {}, proxyOptions);
            });

            it('should rewrite the host header of the proxy request', () => {
                assert.isTrue(proxyRequest.setHeader.withArgs('Host', 'localhost:1234').calledOnce);
            });

            it('should not rewrite the host header of the proxy request if `options.rewriteHostHeader` is `false`', () => {
                proxyServer.on.reset();
                proxyRequest.setHeader.reset();
                options.rewriteHostHeader = false;
                middleware = commandeer(options);
                proxyReqHandler = proxyServer.on.withArgs('proxyReq').firstCall.args[1];
                proxyReqHandler(proxyRequest, {}, {}, proxyOptions);
                assert.isFalse(proxyRequest.setHeader.called);
            });

        });

        it('should handle the proxy server "proxyRes" event', () => {
            assert.isTrue(proxyServer.on.withArgs('proxyRes').calledOnce);
            assert.isFunction(proxyServer.on.withArgs('proxyRes').firstCall.args[1]);
        });

        describe('proxy server "proxyRes" handler', () => {
            let proxyResHandler;
            let proxyResponse;
            let request;

            beforeEach(() => {
                proxyResponse = new http.ServerResponse();
                request = new http.ClientRequest();
                request.url = '/foo';
                proxyResHandler = proxyServer.on.withArgs('proxyRes').firstCall.args[1];
                proxyResHandler(proxyResponse, request);
            });

            it('should log the successful proxying of the request', () => {
                assert.isTrue(options.log.info.withArgs('Proxied "/foo" successfully').calledOnce);
            });

        });

        it('should return a function', () => {
            assert.isFunction(middleware);
        });

        describe('returnedFunction()', () => {
            let next;
            let request;
            let response;

            beforeEach(() => {
                request = new http.ClientRequest();
                request.url = '/foo';
                response = new http.ServerResponse();
                next = sinon.spy();
                middleware(request, response, next);
            });

            it('should call `responseInterceptor` with the response', () => {
                assert.isTrue(responseInterceptor.withArgs(response).calledOnce);
            });

            it('should log that the request is being proxied', () => {
                assert.isTrue(options.log.info.withArgs('Proxying "/foo" to "http://localhost:1234/foo"').calledOnce);
            });

            it('should call `proxyServer.web` with the request and response', () => {
                assert.isTrue(proxyServer.web.withArgs(request, response).calledOnce);
            });

            it('should call `proxyServer.web` with a target of `options.target`', () => {
                assert.strictEqual(proxyServer.web.firstCall.args[2].target, options.target);
            });

            it('should call `proxyServer.web` with an error handler', () => {
                assert.isFunction(proxyServer.web.firstCall.args[3]);
            });

            describe('responseInterceptor `options.condition`', () => {
                let condition;

                beforeEach(() => {
                    condition = responseInterceptor.firstCall.args[1].condition;
                });

                it('should return `true` if response content-type is `options.contentType`', () => {
                    response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit+json');
                    assert.isTrue(condition());
                    response.getHeader.withArgs('content-type').returns('application/X-Commandeer-Unit+json');
                    assert.isTrue(condition());
                    response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit+json; charset=utf-8');
                    assert.isTrue(condition());
                });

                it('should return `false` if response content-type is not `options.contentType`', () => {
                    response.getHeader.withArgs('content-type').returns('text/html');
                    assert.isFalse(condition());
                });

                it('should return `false` if response content-type is not set', () => {
                    assert.isFalse(condition());
                });

                describe('when `options.contentType` is an array', () => {

                    beforeEach(() => {
                        options = {
                            contentType: [
                                'application/x-commandeer-unit1+json',
                                'application/x-commandeer-unit2+json'
                            ],
                            log: options.log,
                            dataProperty: options.dataProperty,
                            target: options.target
                        };
                        middleware = commandeer(options);
                        middleware(request, response, next);
                        condition = responseInterceptor.secondCall.args[1].condition;
                    });

                    it('should return `true` if response content-type is in `options.contentType`', () => {
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit1+json');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/X-Commandeer-Unit1+json');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit1+json; charset=utf-8');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit2+json');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/X-Commandeer-Unit2+json');
                        assert.isTrue(condition());
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit2+json; charset=utf-8');
                        assert.isTrue(condition());
                    });

                    it('should return `false` if response content-type is not in `options.contentType`', () => {
                        response.getHeader.withArgs('content-type').returns('application/x-commandeer-unit+json');
                        assert.isFalse(condition());
                        response.getHeader.withArgs('content-type').returns('text/html');
                        assert.isFalse(condition());
                    });

                });

            });

            describe('responseInterceptor `options.writeHead`', () => {
                let writeHead;

                beforeEach(() => {
                    writeHead = responseInterceptor.firstCall.args[1].writeHead;
                });

                it('should set the response status code', () => {
                    writeHead(200);
                    assert.strictEqual(response.statusCode, 200);
                    writeHead(404);
                    assert.strictEqual(response.statusCode, 404);
                });

                it('should remove the response content-type header', () => {
                    writeHead();
                    assert.isTrue(response.removeHeader.withArgs('Content-Type').calledOnce);
                });

                it('should remove the response content-length header', () => {
                    writeHead();
                    assert.isTrue(response.removeHeader.withArgs('Content-Length').calledOnce);
                });

            });

            describe('responseInterceptor `options.end`', () => {
                let end;
                let write;

                beforeEach(() => {
                    end = responseInterceptor.firstCall.args[1].end;
                    write = responseInterceptor.firstCall.args[1].write;
                });

                it('parse the concatenated result of all `write` calls as JSON and add to response under `options.dataProperty`', () => {
                    write(new Buffer('{'));
                    write(new Buffer('"foo": "bar"'));
                    write(new Buffer('}'));
                    end();
                    assert.deepEqual(response.proxyDataUnit, {
                        foo: 'bar'
                    });
                });

                it('should call `next` with no error if the JSON is valid', () => {
                    write(new Buffer('{}'));
                    end();
                    assert.isTrue(next.calledOnce);
                    assert.isUndefined(next.firstCall.args[0]);
                });

                it('call `next` with an error if the JSON is invalid', () => {
                    write(new Buffer('{"foo"}'));
                    end();
                    assert.isUndefined(response.proxyDataUnit);
                    assert.isTrue(next.calledOnce);
                    assert.isInstanceOf(next.firstCall.args[0], Error);
                    assert.strictEqual(next.firstCall.args[0].message, 'Invalid JSON received');
                });

            });

            describe('`proxyServer.web` error handler', () => {
                let error;
                let errorHandler;

                beforeEach(() => {
                    error = new Error('...');
                    errorHandler = proxyServer.web.firstCall.args[3];
                    errorHandler(error);
                });

                it('should log that the proxy failed', () => {
                    assert.isTrue(options.log.error.withArgs('Failed to proxy "/foo"').calledOnce);
                });

                it('should call `next` with the handled error', () => {
                    assert.isTrue(next.withArgs(error).calledOnce);
                });

            });

        });

    });

    describe('commandeer() with a function `target` option', () => {
        let middleware;
        let options;
        let proxyServer;

        beforeEach(() => {
            options = {
                contentType: 'application/x-commandeer-unit+json',
                dataProperty: 'proxyDataUnit',
                log: {
                    error: sinon.spy(),
                    info: sinon.spy()
                },
                rewriteHostHeader: true,
                target: sinon.stub().returns('http://localhost:1234')
            };
            middleware = commandeer(options);
            proxyServer = httpProxy.createProxyServer.defaultBehavior.returnValue;
        });

        describe('returnedFunction()', () => {
            let next;
            let request;
            let response;

            beforeEach(() => {
                request = new http.ClientRequest();
                response = new http.ServerResponse();
                next = sinon.spy();
                middleware(request, response, next);
            });

            it('should call `options.target` with the request object', () => {
                assert.isTrue(options.target.withArgs(request).calledOnce);
            });

            it('should call `proxyServer.web` with a target set to the return value of `options.target`', () => {
                assert.strictEqual(proxyServer.web.firstCall.args[2].target, options.target.firstCall.returnValue);
            });

        });

    });

});
