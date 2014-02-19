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
var fs = require('fs');
var path = require('path');
var join = path.resolve;
var readdir = fs.readdirSync;
var exists = fs.existsSync;
var _ = require('underscore');
_.str = require('underscore.string');
require('colors');

/*
 * Private Methods
 */

/**
 * Method responsible for loadding api files
 *
 * @class Loader
 * @constructor
 * @example
 *
 *     load(__dirname, function(filePath) {
 *      //
 *    });
 *
 * @method load
 * @private
 * @param {String} root Application root directory
 * @param {Function} cb Callback
 * @return {Function} Returns callback with filePath
 */

function load(root, cb) {
  var fullPath = join(__dirname, '..', 'api', root);
  var ENV = process.env.NODE_ENV || 'development';
  //
  if (root === 'config') {
    var configPath = join(fullPath, ENV);
    //Read this directory
    if (exists(configPath)) {
      readdir(configPath).forEach(function(file) {
        if (fs.statSync(join(configPath, file)).isFile()) {
          //Resolve file path
          var filePath = join(configPath, file);
          //Check if this file exists
          if (exists(filePath)) {
            //Run callback
            var fileName = file.replace(/\.js$/, '');
            fileName = fileName.replace(/\.json$/, '');
            cb(filePath, fileName);
          }
        }
      });
    } else {
      console.log('ERROR: The '.red + ENV.white + ' environment not exists in api/config'.red);
      process.exit(0);
    }
  } else {
    //Read this directory
    readdir(fullPath).forEach(function(file) {
      if (fs.statSync(join(fullPath, file)).isFile()) {
        //Resolve file path
        var filePath = join(fullPath, file);
        //Check if this file exists
        if (exists(filePath)) {
          //Run callback
          var fileName = file.replace(/\.js$/, '');
          fileName = fileName.replace(/\.json$/, '');
          cb(filePath, fileName);
        }
      }
    });
  }
}

/*
 * Public Methods
 */

/**
 * Method responsible for loadding custom settings
 *
 * @example
 *
 *     loader.configs(app, cb);
 *
 * @method configs
 * @public
 * @param {Object} app Instance of express();
 * @param {Function} cb Callback
 */

exports.configs = function(app, cb) {
  //Load Settings

  //Configs NameSpace
  global.configs = [];

  load('config', function(filePath, fileName) {
    //Require configs
    var config = require(filePath);
    //Set configs in global scope
    global.configs[fileName] = config;
    //Set Property
    app.set(fileName, config);
  });

  //run callback
  cb();

};

/**
 * Method responsible for loadding middlewares
 *
 * @example
 *
 *     loader.middlewares(app, cb);
 *
 * @method middlewares
 * @public
 * @param {Object} app Instance of express();
 * @param {Function} cb Callback
 */

exports.middlewares = function(app, cb) {
  //Load Middlewares

  load('middlewares', function(filePath) {
    //Require middleware
    var midd = require(filePath);
    //Check if the middleware is enabled
    if (midd.enabled) {
      app.use(midd.fn());
    }
  });

  //Get middlewares settings
  var middlewares = app.get('middlewares');
  //Read and use middlewares
  for (var mdd in middlewares) {
    //Check if this middleware is enabled
    if (middlewares[mdd].enabled) {
      //use this middleware in app
      app.use(require(middlewares[mdd].name)());
    }
  }

  //run callback
  cb();

};

/**
 * Method responsible for loadding services
 *
 * @example
 *
 *     loader.services(version, app, cb);
 *
 * @method services
 * @public
 * @param {String} version Version of API
 * @param {Object} app Instance of express();
 * @param {Function} cb Callback
 */

exports.services = function(version, app, cb) {
  //Load Webservices

  load('services', function(filePath, fileName) {
    //Check if exists
    if (exists(filePath)) {
      //Require webservice
      var ws = require(filePath);
      //Provide Service
      app.get(path.join('/', version, 'ws', fileName), function(req, res) {
        //Send to client
        res.json(ws);
      });
      //Provide .json service
      app.get(path.join('/', version, 'ws', fileName) + '.json', function(req, res) {
        //Send to client
        res.json(ws);
      });
    }
  });

  //run callback
  cb();

};

/**
 * Method responsible for loadding models
 *
 * @example
 *
 *     loader.models(db);
 *
 * @method models
 * @public
 * @param {Function} cb Callback
 * @param {Object} db Mongoose connection
 */

exports.models = function(cb) {

  //Models NameSpace
  global.models = [];

  //Load Settings
  load('models', function(filePath, fileName) {
    //Provide models in global scope global.models
    global.models[_.str.capitalize(fileName)] = require(filePath);
  });

  //run callback
  cb();

};

/**
 * Method responsible for loadding controllers
 *
 * @example
 *
 *     loader.controllers(version, app, cb);
 *
 * @method controllers
 * @public
 * @param {String} version Version of API
 * @param {Object} app Instance of express();
 * @param {Function} cb Callback
 */

exports.controllers = function(version, app, cb) {
  //Load controllers

  load('controllers', function(filePath, fileName) {
    //Require controller
    var methods = require(filePath);
    //Load All Methods
    _.each(methods, function(ctrl, key) {
      //Check method
      if (ctrl.hasOwnProperty('method')) {
        if (ctrl.hasOwnProperty('path')) {
          var route = ctrl.path.replace(/:default/, fileName);
          //Set controllers using custom routes
          app[ctrl.method.toLowerCase()](path.join('/', version, route), ctrl.fn);
          app[ctrl.method.toLowerCase()](path.join('/', version, route) + '.json', ctrl.fn);
        } else {
          if (methods.hasOwnProperty('index') && methods.index.hasOwnProperty('fn')) {
            //Set Default method
            app[ctrl.method.toLowerCase()](path.join('/', version, fileName), methods.index.fn);
            app[ctrl.method.toLowerCase()](path.join('/', version, fileName) + '.json', methods.index.fn);
          }
          //Load and use default controllers
          app[ctrl.method.toLowerCase()](path.join('/', version, fileName, key), ctrl.fn);
          app[ctrl.method.toLowerCase()](path.join('/', version, fileName, key) + '.json', ctrl.fn);
        }
      } else {
        //Load and use restful controllers
        app.resource(path.join(version, fileName), methods, {
          format: 'json'
        });
      }
    });
  });

  //Load Default Controller
  var defaultCtrl = require(path.resolve(__dirname, '..', 'api', 'controllers', app.get('app').
    default.controller))[app.get('app').
    default.action];

  if (defaultCtrl.hasOwnProperty('fn')) {
    app.get('/' + version, defaultCtrl.fn);
  } else {
    app.get('/' + version, defaultCtrl);
  }

  //run callback
  cb();

};

/**
 * Method responsible for loadding sockets
 *
 * @example
 *
 *     loader.sockets(server, cb);
 *
 * @method sockets
 * @public
 * @param {Object} server Instance of express server
 * @param {Function} cb Callback
 */

exports.sockets = function(server, cb) {

  var io = require('socket.io').listen(server);

  io.set('authorization', function(handshake, cb) {
    cb(null, true);
  });

  //Sockets
  io.of('/socket').on('connection', function(socket) {

    load('sockets', function(filePath, fileName) {
      //Require configs
      var sockets = require(filePath);
      //Load All Sockets
      _.each(sockets, function(s, key) {
        //
        if (s.hasOwnProperty('on') && _.isFunction(s.on)) {
          socket.on(path.join(fileName, key), s.on);
        }
        if (s.hasOwnProperty('emit')) {
          socket.emit(path.join(fileName, key), s.emit);
        }
      });

    });

  });

  //Run callback
  cb();
};