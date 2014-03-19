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

describe('Services', function () {
    describe('Test /ws', function () {
        it('should return a JSON array and http code 200', function (done) {
            request
                .get('/ws/names')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, [{
                    "name": "Bella"
                }, {
                    "name": "Chris"
                }], done);
        });
        it('should return a JSON array and http code 200 with .json extension', function (done) {
            request
                .get('/ws/names.json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, [{
                    "name": "Bella"
                }, {
                    "name": "Chris"
                }], done);
        });
    });
});
