/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

/*
 * Module Dependencies
 */

/*
 * Example
 *
 * var app = api('v1', {http: {port: 8000, options: {}}, https:{port: 4003, options: {}}});
 */

var api = require('./lib/demi.js');
var app = api();
