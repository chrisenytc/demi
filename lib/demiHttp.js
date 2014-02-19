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

var mongoose = require('mongoose');
var loader = require('./loader');
var express = require('express');
var http = require('http');
var debug = require('./debugger');
var logger = require('demi-logger');
var bella = require('bella');
var cors = require('cors');
require('express-resource');
require('colors');

/*
 * Private Methods
 */

function loadConfigs(app, cb) {
  //Load configs
  return loader.configs(app, cb);
}

function loadMiddlewares(app, cb) {
  //Load middlewares
  return loader.middlewares(app, cb);
}

function loadServices(version, app, cb) {
  //Load services
  return loader.services(version, app, cb);
}

function loadModels(cb) {
  //Load models
  return loader.models(cb);
}

function loadControllers(version, app, cb) {
  //Load controllers
  return loader.controllers(version, app, cb);
}

function loadSockets(server, cb) {
  //Load sockets
  return loader.sockets(server, cb);
}

/**
 * Constructor
 *
 * @class DemiHttp
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
  loadConfigs(app, function() {
    debug('Custom settings loadded', 'success', 'http');
  });

  //Port
  app.set('port', process.env.PORT || 20892);

  //Jsonp support
  app.enable('jsonp callback');

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

    //
    if (app.get('env') !== 'test') {
      db.on('error', console.error.bind(console, 'Connection error:'.red));
    }
    db.on('connected', function() {
      debug('MongoDB connected successfully', 'success', 'http');
    });
    db.on('disconnected', function() {
      debug('MongoDB disconnected', 'warning', 'http');
    });

  }

  //All environments
  app.configure(function() {

    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(express.responseTime());
    app.use(function(req, res, next) {
      res.removeHeader('X-Powered-By');
      res.setHeader('X-Powered-By', app.get('app').powered_by);
      next();
    });

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

    //Cors Options
    var corsOptions = app.get('cors');
    //Cors
    if (corsOptions.allRoutes) {
      app.use(cors(corsOptions));
      debug('CORS support enabled', 'success', 'http');
    }

    //Logger
    if (app.get('env') !== 'test') {
      app.use(express.logger(logger));
    }

    //Router
    app.use(app.router);

  });

  //Error 500 Handler
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    var error500 = app.get('errors')['500'].message.replace(/:method/, req.method).replace(/:path/, req.url);
    res.jsonp(500, {
      message: error500,
      error: err,
      documentation_url: app.get('api').documentation_url
    });
  });

  //Error 404 Handler
  app.use(function(req, res) {
    var error404 = app.get('errors')['404'].message.replace(/:method/, req.method).replace(/:path/, req.url);
    res.jsonp(404, {
      message: error404,
      documentation_url: app.get('api').documentation_url
    });
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      debug('Mongoose disconnected through app termination', 'error', 'http');
      process.exit(0);
    });
  });

  //Load Custom Middlewares
  loadMiddlewares(app, function() {
    debug('Middlewares loadded', 'success', 'http');
  });

  /*
   * Models
   */

  //Load Models
  loadModels(function() {
    debug('Models loadded', 'success', 'http');
  });

  /*
   * Controllers
   */

  //Load Routes and Controllers
  loadControllers(version, app, function() {
    debug('Controllers loadded', 'success', 'http');
  });

  /*
   * Services
   */
  loadServices(version, app, function() {
    debug('Services loadded', 'success', 'http');
  });

  //Define port
  app.set('port', port || app.get('port'));

  //Server
  var server;

  if (app.get('env') !== 'test') {
    //Init Server
    server = http.createServer(app).listen(app.get('port'), function() {
      //Log init
      console.log('[ ' + 'HTTP'.bold + ' ] ' + 'API '.green.bold + version + ' running on port '.green + ' [ ' + String(app.get('port')).bold + ' ] ' + ' and using '.green + ' [ ' + app.get('env').white.bold + ' ] ' + ' environment'.green);
      console.log('');

    });
  }

  //Load Routes and Controllers
  if (app.get('app').socket) {
    loadSockets(server, function() {
      debug('Sockets loadded', 'success', 'http');
    });
  }

  //Return
  return app;

}

//Exports
module.exports = Demi;