/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

var supertest = require('supertest');
var demi = require('../lib/demi.js');
var request = supertest(demi());
var chai = require('chai');
chai.expect();
chai.should();

describe('tasks controller', function () {
    describe('Test /tasks', function () {
        //GET
        it('should return a empty json object', function (done) {
            request
                .get('/tasks')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, [], done);
        });
        //POST
        it('should be create a new task and return a success message', function (done) {
            request
                .post('/tasks')
                .send({
                    title: 'Testing 1',
                    slug: 'testing-1',
                    content: 'content text 1'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    message: 'Task created successfully',
                    task: {
                        title: 'Testing 1',
                        slug: 'testing-1',
                        content: 'content text 1'
                    }
                }, done);
        });
        //PUT
        it('should be update the passed task with this data', function (done) {
            request
                .put('/tasks/testing-1')
                .send({
                    title: 'Testing new title 1',
                    slug: 'testing-1',
                    content: 'content new text 1'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    message: 'Task testing-1 updated successfully'
                }, done);
        });
        //DELETE
        it('should be remove this task', function (done) {
            request
                .del('/tasks/testing-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    message: 'Task testing-1 removed successfully'
                }, done);
        });
    });

    //Tasks.json

    describe('Test /tasks.json', function () {
        //GET
        it('should return a empty json object', function (done) {
            request
                .get('/tasks.json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, [], done);
        });
        //POST
        it('should be create a new task and return a success message', function (done) {
            request
                .post('/tasks')
                .send({
                    title: 'Testing 1',
                    slug: 'testing-1',
                    content: 'content text 1'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    message: 'Task created successfully',
                    task: {
                        title: 'Testing 1',
                        slug: 'testing-1',
                        content: 'content text 1'
                    }
                }, done);
        });
        //PUT
        it('should be update the passed task with this data', function (done) {
            request
                .put('/tasks/testing-1')
                .send({
                    title: 'Testing new title 1',
                    slug: 'testing-1',
                    content: 'content new text 1'
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    message: 'Task testing-1 updated successfully'
                }, done);
        });
        //DELETE
        it('should be remove this task', function (done) {
            request
                .del('/tasks/testing-1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    message: 'Task testing-1 removed successfully'
                }, done);
        });
    });
});
