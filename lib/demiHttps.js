/*
 * demi
 * httpss://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

/*
 * Module Dependencies
 */

var mongoose = require('mongoose');
var loader = require(__dirname + '/loader.js');
var express = require('express');
var https = require('https');
var debug = require(__dirname + '/debugger.js');
var logger = require('demi-logger');
var passport = require('passport');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
require('colors');

/**
 * Constructor
 *
 * @class DemiHttps
 * @constructor
 *
 * @example
 *
 *     var api = demi('v1', 80, {});
 *
 * @param {String} version The version of API
 * @param {String} port The app port
 * @param {Object} options The mongoose connect options
 * @return {Object} Returns a instance of express();
 */

function Demi(version, port, options) {

    /*
     * Environment.
     */

    var app = express();

    /*
     * Configs
     */

    //Load Custom settings
    loader.configs(app, function () {
        debug('Custom settings loadded', 'success', 'https');
    });

    //Https Options
    var httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, 'ssl', global.configs.ssl.key)),
        cert: fs.readFileSync(path.join(__dirname, 'ssl', global.configs.ssl.cert))
    };

    //Port
    app.set('port', process.env.PORT || 20892);

    //Trust proxy support
    if (app.get('app').httpsssss) {
        app.enable('trust proxy');
    }

    //Jsonp support
    app.enable('jsonp callback');

    //Db
    var db;
    //Database manager
    if (app.get('database').enabled) {

        //Define db instance
        options = options || {};
        //DBAAS
        var mongoUri = process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            app.get('database').uri;
        //Bootstrap db connection
        if (mongoose.connection.readyState) {
            //
            db = mongoose.connection;
        } else {
            mongoose.connect(mongoUri, options);
            db = mongoose.connection;
        }

        //Connection
        if (app.get('env') !== 'test') {
            db.on('error', console.error.bind(console, 'Connection error:'.red));
        }
        db.on('connected', function () {
            debug('MongoDB connected successfully', 'success', 'https');
        });
        db.on('disconnected', function () {
            debug('MongoDB disconnected', 'warning', 'https');
        });
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                debug('Mongoose disconnected through app termination', 'error', 'https');
                process.exit(0);
            });
        });

    }

    //All environments
    app.configure(function () {

        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());

        //Powered by
        app.use(function (req, res, next) {
            res.removeHeader('X-Powered-By');
            res.setHeader('X-Powered-By', app.get('app').powered_by);
            next();
        });

        //Load Custom Middlewares
        loader.middlewares(app, function () {
            debug('Middlewares loadded', 'success', 'https');
        });

        //Check if authentication is enabled
        if (app.get('auth').enabled) {
            //Authentication provider
            app.use(passport.initialize());
        }

        //AuthManager
        global.requireLogin = passport.authenticate('bearer', {
            session: false
        });

        //RoleManager
        global.requireRole = function requireRole(role) {
            return [
                passport.authenticate('bearer', {
                    session: false
                }),
                function (req, res, next) {
                    if (req.user && req.user.role === role) {
                        next();
                    } else {
                        res.jsonp(401, {
                            error: 'Bad Authentication. You do not have permission to access the API.'
                        });
                    }
                }
            ];
        };

        //Cors Options
        var corsOptions = app.get('cors');

        //Cors
        if (corsOptions.allRoutes) {
            app.use(cors(corsOptions));
            debug('CORS support enabled', 'success', 'https');
        }

        //Logger
        if ('test' !== app.get('env')) {
            app.use(express.logger(logger));
        }

        //ResponseTime
        app.use(express.responseTime());

        //Router
        app.use(app.router);

    });

    //Error 500 Handler
    app.use(function (err, req, res, next) {
        //Error message
        var error;
        //Handler
        if (err.message === 'Validation failed') {
            var errorList = [];
            var errorMessages = err.errors;
            for (var e in errorMessages) {
                errorList.push(errorMessages[e].message.replace(new RegExp('Path', 'g'), 'The'));
            };
            error = errorList;
        } else {
            if (!err.message) {
                error = err;
            } else {
                error = err.message;
            }
        }
        //Error
        var error500 = app.get('errors')['500'].message.replace(/:method/, req.method).replace(/:path/, req.url);
        res.jsonp(500, {
            message: error500,
            error: error || '',
            documentation_url: app.get('api').documentation_url
        });

        if ('development' === app.get('env')) {
            if (!err.stack) {
                console.error('Error: ' + err.red);
            } else {
                console.error(err.stack.red);
            }
        }
    });

    //Error 404 Handler
    app.use(function (req, res) {
        var error404 = app.get('errors')['404'].message.replace(/:method/, req.method).replace(/:path/, req.url);
        res.jsonp(404, {
            message: error404,
            documentation_url: app.get('api').documentation_url
        });
    });

    /*
     * Models
     */

    //Load Models
    loader.models(function () {
        debug('Models loadded', 'success', 'https');
    });

    /*
     * Controllers
     */

    //Load Routes and Controllers
    loader.controllers(version, app, function () {
        debug('Controllers loadded', 'success', 'https');
    });

    /*
     * Services
     */
    loader.services(version, app, function () {
        debug('Services loadded', 'success', 'https');
    });

    /*
     * Passport
     */
    require(__dirname + '/passport')(passport);

    //Define port
    app.set('port', port || app.get('port'));

    //Server
    var server;

    if (app.get('env') !== 'test') {
        //Init Server
        server = https.createServer(httpsOptions, app).listen(app.get('port'), function () {
            //Log init
            console.log('[ ' + 'HTTPS'.bold + ' ] ' + 'API '.green.bold + version + ' running on port '.green + ' [ ' + String(app.get('port')).bold + ' ] ' + ' and using '.green + ' [ ' + app.get('env').white.bold + ' ] ' + ' environment'.green);
            console.log('');

        });
    }

    //Load Routes and Controllers
    if (app.get('app').socket) {
        loader.sockets(server, function () {
            debug('Sockets loadded', 'success', 'https');
        });
    }

    //Return
    return app;

}

//Exports
module.exports = Demi;
