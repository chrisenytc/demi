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

    /*
     * GET /index
     */
    index: function (req, res) {
        res.jsonp(200, {
            welcome: 'Welcome to Demi API'
        });
    }
};
