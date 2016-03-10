// jscs:disable maximumLineLength, requireArrowFunctions
'use strict';

const assert = require('proclaim');

describe('Text routes', function () {

    describe('GET /text', function () {

        beforeEach(function (done) {
            this.request('get', '/text', {}, done);
        });

        it('should respond with the correct body', function () {
            assert.strictEqual(this.body, 'text');
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 200);
        });

        it('should respond with the correct content-type header', function () {
            assert.strictEqual(this.response.headers['content-type'], 'text/plain');
        });

    });

    describe('GET /text-with-status', function () {

        beforeEach(function (done) {
            this.request('get', '/text-with-status', {}, done);
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 400);
        });

    });

    describe('GET /text-with-header', function () {

        beforeEach(function (done) {
            this.request('get', '/text-with-header', {}, done);
        });

        it('should respond with the expected header', function () {
            assert.strictEqual(this.response.headers['x-header'], 'value');
        });

    });

    describe('POST /text', function () {

        beforeEach(function (done) {
            this.request('post', '/text', {}, done);
        });

        it('should respond with the correct body', function () {
            assert.strictEqual(this.body, 'text');
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 200);
        });

        it('should respond with the correct content-type header', function () {
            assert.strictEqual(this.response.headers['content-type'], 'text/plain');
        });

    });

    describe('POST /text-with-status', function () {

        beforeEach(function (done) {
            this.request('post', '/text-with-status', {}, done);
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 400);
        });

    });

    describe('POST /text-with-header', function () {

        beforeEach(function (done) {
            this.request('post', '/text-with-header', {}, done);
        });

        it('should respond with the expected header', function () {
            assert.strictEqual(this.response.headers['x-header'], 'value');
        });

    });

});
