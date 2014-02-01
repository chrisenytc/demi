/*
 * demi
 * https://github.com/chrisenytc/demi
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var supertest = require('supertest');
var Demi = require('../lib/demi.js');
var request = supertest(new Demi());
var chai = require('chai');
chai.expect();
chai.should();

describe('routes controller', function () {
  describe('Test /routes', function () {
    //GET
    it('should return a success GET request and http code 200', function (done) {
      request
        .get('/routes')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'GET'
        }, done);
    });
    //GET
    it('should return a success GET request and http code 200', function (done) {
      request
        .get('/routes/index')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'GET'
        }, done);
    });
    //POST
    it('should return a success POST request and http code 200', function (done) {
      request
        .post('/routes/post')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'POST'
        }, done);
    });
    //PUT
    it('should return a success PUT request and http code 200', function (done) {
      request
        .put('/routes/put')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'PUT'
        }, done);
    });
    //DELETE
    it('should return a success DELETE request and http code 200', function (done) {
      request
        .del('/routes/del')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'DELETE'
        }, done);
    });
  });

  //Routes.json

  describe('Test /routes', function () {
    //GET
    it('should return a success GET request and http code 200', function (done) {
      request
        .get('/routes.json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'GET'
        }, done);
    });
    //GET
    it('should return a success GET request and http code 200', function (done) {
      request
        .get('/routes/index.json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'GET'
        }, done);
    });
    //POST
    it('should return a success POST request and http code 200', function (done) {
      request
        .post('/routes/post.json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'POST'
        }, done);
    });
    //PUT
    it('should return a success PUT request and http code 200', function (done) {
      request
        .put('/routes/put.json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'PUT'
        }, done);
    });
    //DELETE
    it('should return a success DELETE request and http code 200', function (done) {
      request
        .del('/routes/del.json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          message: 'Request received successfully!',
          method: 'DELETE'
        }, done);
    });
  });
});
