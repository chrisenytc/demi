/*
 * demi
 * https://github.com/chrisenytc/demi
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {

 /*
  * GET /
  */

 index: {
  method: 'GET',
  fn: function (req, res) {
   res.json(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 },
 post: {
  method: 'POST',
  fn: function (req, res) {
   res.json(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 },
 put: {
  method: 'PUT',
  fn: function (req, res) {
   res.json(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 },
 del: {
  method: 'DEL',
  fn: function (req, res) {
   res.json(200, {
    message: 'Request received successfully!',
    method: req.method
   });
  }
 }
};
