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

require('colors');


module.exports = function (msg, type, connType) {
    var env = process.env.NODE_ENV || 'development';
    var date = new Date();
    if ('test' !== env) {
        switch (type) {
        case 'error':
            console.log('\n[ ' + connType.toUpperCase().bold.red + ' ]' + ' ' + env.bold + ' -----> '.red + msg.bold.red + ' ==> '.red + date.getMilliseconds() + 'ms');
            break;
        case 'warning':
            console.log('\n[ ' + connType.toUpperCase().bold.yellow + ' ]' + ' ' + env.bold + ' ----->  '.yellow + msg.yellow + ' ==> '.yellow + date.getMilliseconds() + 'ms');
            break;
        case 'info':
            console.log('[ ' + connType.toUpperCase().bold.cyan + ' ]' + ' ' + env.bold + ' ----->  '.cyan + msg.bold.cyan + ' ==> '.cyan + date.getMilliseconds() + 'ms');
            break;
        case 'success':
            console.log('[ ' + connType.toUpperCase().bold.green + ' ]' + ' ' + env.bold + ' ----->  '.green + msg.green + ' ==> '.green + date.getMilliseconds() + 'ms');
            break;
        }
    }
};
