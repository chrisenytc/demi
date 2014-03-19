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

var http = require('./demiHttp.js');
var https = require('./demiHttps.js');
require('colors');

/**
 * Constructor
 *
 * @class Demi
 * @constructor
 *
 * @example
 *
 *     var api = demi('v1', {http: {port: 8000, options: {}}, https:{port: 4003, options: {}}});
 *
 * @method Demi
 * @param {String} version Version of API e.g: v1
 * @param {Object} options The mongoose connect options
 * @return {Object} Returns a instance of http() and https();
 */

function Demi(version, options) {

    /*
     * Environment.
     */

    //Set options for the API
    options = options || {
        http: {
            port: 20892,
            mongooseOptions: {}
        },
        https: {
            port: 20892,
            mongooseOptions: {}
        }
    };

    //Set version of the API
    version = version || '';

    var demi;

    //Get settings
    var env = process.env.NODE_ENV || 'development';

    var enableHttps = require('../api/config/' + env + '/app.json').https;
    //
    if (enableHttps) {
        demi = new https(version, options.https.port, options.https.mongooseOptions);
    } else {
        demi = new http(version, options.http.port, options.http.mongooseOptions);
    }
    //
    console.log('');
    //
    console.log('[ ' + String(demi.get('port')).bold + ' ]' + ' An instance of the API was started on '.green + '/'.white.bold + version.white.bold);
    //
    console.log('');

    //Return
    return demi;

}

//Exports
module.exports = Demi;
