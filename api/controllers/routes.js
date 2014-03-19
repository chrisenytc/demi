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
     * GET /routes
     */

    /*
     * GET /routes/index
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

    /*
     * POST /routes
     */
    post: {
        method: 'POST',
        fn: function (req, res) {
            res.jsonp(200, {
                message: 'Request received successfully!',
                method: req.method
            });
        }
    },

    /*
     * PUT /routes
     */
    put: {
        method: 'PUT',
        fn: function (req, res) {
            res.jsonp(200, {
                message: 'Request received successfully!',
                method: req.method
            });
        }
    },

    /*
     * DELETE /routes
     */
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
