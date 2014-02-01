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

var mongoose = require('mongoose');
var loader = require('./loader');
var express = require('express');
var debug = require('./debugger');
var bella = require('bella');
var cors = require('cors');
var path = require('path');
require('express-resource');

/**
@class Demi
 */

/*
 * Private Methods
 */

function loadConfigs(app) {
  //Load middlewares
  return loader.configs(app);
}

function loadMiddlewares(app) {
  //Load middlewares
  return loader.middlewares(app);
}

function loadServices(app) {
  //Load middlewares
  return loader.services(app);
}

function loadModels() {
  //Load middlewares
  return loader.models();
}

function loadControllers(app) {
  //Load middlewares
  return loader.controllers(app);
}

/*
 * Public Methods
 */

/**
 * Constructor
 *
 * @example
 *
 *     var api = demi(5000);
 *
 * @method Demi
 * @param {String} port The app port
 * @return {Object} Returns a instance of express();
 */

function Demi(port) {

  /*
   * Environment.
   */

  var app = express();

  // all environments
  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger({
      immediate: true,
      format: 'dev'
    }));
    app.use(express.responseTime());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.compress());
    app.use(express.methodOverride());
  });


  /*
   * Middlewares.
   */

  //Load Custom settings
  loadConfigs(app);
  //
  debug('Custom Settings loadded', 'success');

  if (app.get('database').enabled) {

    //Define db instance
    var options = {};
    //Bootstrap db connection
    mongoose.connect(app.get('database').uri, options);
    //
    var db = mongoose.connection;

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
    db.on('error', console.error.bind(console, 'Connection error:'.red));
    db.on('connected', function () {
      debug('MongoDB connected successfully', 'success');
    });
    db.on('disconnected', function () {
      debug('MongoDB disconnected', 'warning');
    });
  }

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      debug('Mongoose default connection disconnected through app termination', 'info');
      process.exit(0);
    });
  });

  //Load Custom Middlewares
  loadMiddlewares(app);
  //
  debug('Middlewares loadded', 'success');

  /*
   * Models
   */

  //Load Models
  loadModels();
  //
  debug('Models loadded', 'success');

  //Cors Options
  var corsOptions = app.get('cors');
  //Cors
  if (corsOptions.allRoutes) {
    app.use(cors(corsOptions));
    debug('CORS support enabled', 'info');
  }

  // development only
  if ('development' === app.get('env')) {
    app.use(express.errorHandler());
  }

  //Router
  app.use(app.router);

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    var error500 = app.get('errors')['500'].message.replace(/:method/, req.method).replace(/:path/, req.url);
    res.json(500, {
      message: error500,
      error: err,
      documentation_url: app.get('api').documentation_url
    });
  });

  app.use(function (req, res) {
    var error404 = app.get('errors')['404'].message.replace(/:method/, req.method).replace(/:path/, req.url);
    res.json(404, {
      message: error404,
      documentation_url: app.get('api').documentation_url
    });
  });

  /*
   * Controllers
   */

  //Load Routes and Controllers
  loadControllers(app);
  //
  debug('Controllers loadded', 'success');
  //Load Default Controller
  app.get('/', require(path.resolve(__dirname, '..', 'api', 'controllers', app.get('app').
    default.controller))[app.get('app').
    default.action]);

  /*
   * Services
   */
  loadServices(app);
  //
  debug('Services loadded', 'success');

  //Define port
  app.set('port', port || app.get('port'));

  if(app.get('env') !== 'test') {
    //Run demi
    app.listen(app.get('port'));
    //Log init
    console.log('Demi running on port '.green + app.get('port') + ' and using '.green + app.get('env').white + ' environment'.green);
  }

  //Return
  return app;

}

//Exports
module.exports = Demi;
