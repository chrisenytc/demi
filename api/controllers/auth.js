/*
 * ully
 * https://bitbucket.org/enytc/ully
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

var hat = require('hat');
var rack = hat.rack();
var User = global.models.User;

module.exports = {

    /*
     * POST /auth
     */

    /*
     * POST /auth/index
     */
    index: {
        method: 'POST',
        fn: function index(req, res, next) {
            //Create
            var user = new User(req.body);
            user.token = rack();
            user.save(function (err) {
                if (err) {
                    return next(err);
                }
                //Send message
                res.jsonp(200, {
                    message: 'An access token has been generated successfully.',
                    token: user.token
                });
            });
        }
    }
}
