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
var loader = require('./loader');
var express = require('express');
var https = require('https');
var debug = require('./debugger');
var logger = require('demi-logger');
var bella = require('bella');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
require('express-resource');
require('colors');

/*
 * Private Methods
 */

function loadConfigs(app, cb) {
  //Load middlewares
  return loader.configs(app, cb);
}

function loadMiddlewares(app, cb) {
  //Load middlewares
  return loader.middlewares(app, cb);
}

function loadServices(version, app, cb) {
  //Load middlewares
  return loader.services(version, app, cb);
}

function loadModels(cb) {
  //Load middlewares
  return loader.models(cb);
}

function loadControllers(version, app, cb) {
  //Load middlewares
  return loader.controllers(version, app, cb);
}

/**
 * Constructor
 *
 * @class DemiHttps
 * @constructor
 *
 * @example
 *
 *     var api = demi('v1', 403, {});
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
   * Middlewares.
   */

  //Load Custom settings
  loadConfigs(app, function () {
    debug('Custom settings loadded', 'success', 'https');
  });
  //

  //https
  var httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', global.configs.ssl.key)),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', global.configs.ssl.cert))
  };

  //All environments
  app.configure(function () {
    app.set('port', process.env.PORT || 20892);
    if (app.get('app').https) {
      app.enable('trust proxy');
    }
    app.use(express.favicon());
    if (app.get('env') !== 'test') {
      app.use(express.logger(logger));
    }
    app.use(express.responseTime());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.compress());
    app.use(express.methodOverride());

    //Cors Options
    var corsOptions = app.get('cors');
    //Cors
    if (corsOptions.allRoutes) {
      app.use(cors(corsOptions));
      debug('CORS support enabled', 'success', 'https');
    }

    //errorHanddler

    // development only
    if ('development' === app.get('env')) {
      app.use(express.errorHandler());
    }

    //Database manager
    if (app.get('database').enabled) {

      //Define db instance
      options = options || {};
      //Db
      var db;
      //Bootstrap db connection
      if (mongoose.connection.readyState) {
        //
        db = mongoose.connection;
      } else {
        mongoose.connect(app.get('database').uri, options);
        db = mongoose.connection;
      }

      //Check if authentication is enabled
      if (app.get('auth').enabled) {
        //Authentication provider
        app.use(bella.init(mongoose, db, [{
          username: app.get('auth').user,
          password: app.get('auth').pass
      }]));
        //Start monitoring
        app.use(bella.authenticate());
      }

      //
      if (app.get('env') !== 'test') {
        db.on('error', console.error.bind(console, 'Connection error:'.red));
      }
      db.on('connected', function () {
        debug('MongoDB connected successfully', 'success', 'https');
      });
      db.on('disconnected', function () {
        debug('MongoDB disconnected', 'warning', 'https');
      });

    }

    //Router
    app.use(app.router);
    //Error 500 Handler
    app.use(function (err, req, res, next) {
      console.error(err.stack);
      var error500 = app.get('errors')['500'].message.replace(/:method/, req.method).replace(/:path/, req.url);
      res.jsonp(500, {
        message: error500,
        error: err,
        documentation_url: app.get('api').documentation_url
      });
    });
    //Error 404 Handler
    app.use(function (req, res) {
      var error404 = app.get('errors')['404'].message.replace(/:method/, req.method).replace(/:path/, req.url);
      res.jsonp(404, {
        message: error404,
        documentation_url: app.get('api').documentation_url
      });
    });

  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      debug('Mongoose disconnected through app termination', 'error', 'https');
      process.exit(0);
    });
  });

  //Load Custom Middlewares
  loadMiddlewares(app, function () {
    debug('Middlewares loadded', 'success', 'https');
  });

  /*
   * Models
   */

  //Load Models
  loadModels(function () {
    debug('Models loadded', 'success', 'https');
  });

  /*
   * Controllers
   */

  //Load Routes and Controllers
  loadControllers(version, app, function () {
    debug('Controllers loadded', 'success', 'https');
  });

  //Load Default Controller
  app.get('/' + version, require(path.resolve(__dirname, '..', 'api', 'controllers', app.get('app').
    default.controller))[app.get('app').
    default.action]);

  /*
   * Services
   */
  loadServices(version, app, function () {
    debug('Services loadded', 'success', 'https');
  });

  //Define port
  app.set('port', port || app.get('port'));

  if (app.get('env') !== 'test') {
    //
    https.createServer(httpsOptions, app).listen(app.get('port'), function () {
      //Log init
      console.log('[ ' + 'HTTPS'.bold + ' ] ' + 'API '.green.bold + version + ' running on port '.green + ' [ ' + String(app.get('port')).bold + ' ] ' + ' and using '.green + ' [ ' + app.get('env').white.bold + ' ] ' + ' environment'.green);
      console.log('');

    });
  }

  //Return
  return app;

}

//Exports
module.exports = Demi;
