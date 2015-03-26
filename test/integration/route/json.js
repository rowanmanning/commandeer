/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');

describe('JSON Routes', function () {

    describe('GET /json', function () {

        beforeEach(function (done) {
            this.request('get', '/json', {}, done);
        });

        it('should respond with the correct body', function () {
            assert.deepEqual(this.body, {});
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 200);
        });

        it('should respond with the correct content-type header', function () {
            assert.strictEqual(this.response.headers['content-type'], 'application/json');
        });

    });

    describe('GET /json-with-status', function () {

        beforeEach(function (done) {
            this.request('get', '/json-with-status', {}, done);
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 400);
        });

    });

    describe('GET /json-with-header', function () {

        beforeEach(function (done) {
            this.request('get', '/json-with-header', {}, done);
        });

        it('should respond with the expected header', function () {
            assert.strictEqual(this.response.headers['x-header'], 'value');
        });

    });

    describe('POST /json', function () {

        beforeEach(function (done) {
            this.request('post', '/json', {}, done);
        });

        it('should respond with the correct body', function () {
            assert.deepEqual(this.body, {});
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 200);
        });

        it('should respond with the correct content-type header', function () {
            assert.strictEqual(this.response.headers['content-type'], 'application/json');
        });

    });

    describe('POST /json-with-status', function () {

        beforeEach(function (done) {
            this.request('post', '/json-with-status', {}, done);
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 400);
        });

    });

    describe('POST /json-with-header', function () {

        beforeEach(function (done) {
            this.request('post', '/json-with-header', {}, done);
        });

        it('should respond with the expected header', function () {
            assert.strictEqual(this.response.headers['x-header'], 'value');
        });

    });

});
