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

var User = global.models.User;
var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function (passport) {

    // Use the BearerStrategy within Passport.
    //   Strategies in Passport require a `validate` function, which accept
    //   credentials (in this case, a token), and invoke a callback with a user
    //   object.
    passport.use(new BearerStrategy(
        function (token, done) {
            User.findOne({
                token: token
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user, {
                    scope: 'all'
                });
            });
        }
    ));
};
