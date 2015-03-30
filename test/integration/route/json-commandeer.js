/* jshint maxstatements: false, maxlen: false */
/* global beforeEach, describe, it */
'use strict';

var assert = require('proclaim');

describe('Commandeerable JSON Routes', function () {

    describe('GET /json-commandeer', function () {

        beforeEach(function (done) {
            this.request('get', '/json-commandeer', {}, done);
        });

        it('should respond with the correct body', function () {
            assert.deepEqual(this.body, {
                commandeered: true
            });
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 200);
        });

        it('should respond with the correct content-type header', function () {
            assert.isUndefined(this.response.headers['content-type']);
        });

    });

    describe('GET /json-commandeer-with-status', function () {

        beforeEach(function (done) {
            this.request('get', '/json-commandeer-with-status', {}, done);
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 400);
        });

    });

    describe('GET /json-commandeer-with-header', function () {

        beforeEach(function (done) {
            this.request('get', '/json-commandeer-with-header', {}, done);
        });

        it('should respond with the expected header', function () {
            assert.strictEqual(this.response.headers['x-header'], 'value');
        });

    });

    describe('POST /json-commandeer', function () {

        beforeEach(function (done) {
            this.request('post', '/json-commandeer', {}, done);
        });

        it('should respond with the correct body', function () {
            assert.deepEqual(this.body, {
                commandeered: true
            });
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 200);
        });

        it('should respond with the correct content-type header', function () {
            assert.isUndefined(this.response.headers['content-type']);
        });

    });

    describe('POST /json-commandeer-with-status', function () {

        beforeEach(function (done) {
            this.request('post', '/json-commandeer-with-status', {}, done);
        });

        it('should respond with the correct status code', function () {
            assert.strictEqual(this.response.statusCode, 400);
        });

    });

    describe('POST /json-commandeer-with-header', function () {

        beforeEach(function (done) {
            this.request('post', '/json-commandeer-with-header', {}, done);
        });

        it('should respond with the expected header', function () {
            assert.strictEqual(this.response.headers['x-header'], 'value');
        });

    });

});
