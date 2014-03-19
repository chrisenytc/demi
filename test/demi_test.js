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

describe('demi module', function () {
    describe('#demi()', function () {
        it('should return a welcome', function (done) {
            request
                .get('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    welcome: 'Welcome to Demi API',
                }, done);
        });
    });
});
