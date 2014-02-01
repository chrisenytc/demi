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

describe('demi module', function () {
  describe('#demi()', function () {
    it('should return a welcome', function (done) {
      request
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          welcome: 'Welcome to Demi API'
        }, done);
    });
  });
});
