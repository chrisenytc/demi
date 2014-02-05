/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

module.exports = {

 /*
  * GET /
  */

 index: {
  method: 'GET',
  fn: function (req, res) {
   res.jsonp(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 },
 post: {
  method: 'POST',
  fn: function (req, res) {
   res.jsonp(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 },
 put: {
  method: 'PUT',
  fn: function (req, res) {
   res.jsonp(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 },
 delete: {
  method: 'DELETE',
  fn: function (req, res) {
   res.jsonp(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 }
};
