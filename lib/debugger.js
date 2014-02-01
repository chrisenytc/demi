/*
 * demi
 * https://github.com/chrisenytc/demi
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Module Dependencies
 */

require('colors');


module.exports = function (msg, type) {
  var env = process.env.NODE_ENV || 'development';
  var date = new Date();
  if ('test' !== env) {
    switch (type) {
    case 'error':
      console.log('ERROR: '.red + msg.red + ' => '.red + date.getMilliseconds() + 'ms');
      break;
    case 'warning':
      console.log('WARNING: '.yellow + msg.yellow + ' => '.yellow + date.getMilliseconds() + 'ms');
      break;
    case 'info':
      console.log('INFO: '.blue + msg.blue + ' => '.blue + date.getMilliseconds() + 'ms');
      break;
    case 'success':
      console.log('SUCCESS: '.green + msg.green + ' => '.green + date.getMilliseconds() + 'ms');
      break;
    }
  }
};
