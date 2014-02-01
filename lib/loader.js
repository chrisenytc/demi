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
var fs = require('fs');
var path = require('path');
var join = path.resolve;
var readdir = fs.readdirSync;
var exists = fs.existsSync;
var _ = require('underscore');
_.str = require('underscore.string');
require('colors');

/**
@class Loader
 */

/*
 * Private Methods
 */


/**
 * Method responsible for loadding api files
 *
 * @example
 *
 *     load(__dirname, function(filePath) {
 *      //
 *    });
 *
 * @method load
 * @param {String} root Application root directory
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
      readdir(configPath).forEach(function (file) {
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
    readdir(fullPath).forEach(function (file) {
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
 *     loader.configs(app);
 *
 * @method configs
 * @param {Object} app Instance of express();
 */

exports.configs = function (app) {
  //Load Settings

  load('config', function (filePath, fileName) {
    //
    var config = require(filePath);
    //Set Property
    app.set(fileName, config);
  });

};

/**
 * Method responsible for loadding middlewares
 *
 * @example
 *
 *     loader.middlewares(app);
 *
 * @method middlewares
 * @param {Object} app Instance of express();
 */

exports.middlewares = function (app) {
  //Load Middlewares

  load('middlewares', function (filePath) {
    //Require middleware
    var midd = require(filePath);
    //Check if the middleware is enabled
    if (midd.enabled) {
      app.use(midd.fn());
    }
  });

  var middlewares = app.get('middlewares');

  for(var mdd in middlewares) {
    if(middlewares[mdd].enabled) {
      app.use(require(middlewares[mdd].name)());
    }
  }

};

/**
 * Method responsible for loadding services
 *
 * @example
 *
 *     loader.services(app);
 *
 * @method services
 * @param {Object} app Instance of express();
 */

exports.services = function (app) {
  //Load Webservices

  load('services', function (filePath, fileName) {
    //Check if exists
    if (exists(filePath)) {
      //Require webservice
      var ws = require(filePath);
      //Send WebService
      app.get('/ws/' + fileName, function (req, res) {
        res.json(ws);
      });

      app.get('/ws/' + fileName + '.json', function (req, res) {
        res.json(ws);
      });
    }
  });

};

/**
 * Method responsible for loadding models
 *
 * @example
 *
 *     loader.models(db);
 *
 * @method models
 * @param {Object} db Mongoose connection
 */

exports.models = function () {
  //Load Settings

  //Models NameSpace

  global.models = [];

  load('models', function (filePath, fileName) {
    //Require settings
    global.models[_.str.capitalize(fileName)] = require(filePath);
  });

};

/**
 * Method responsible for loadding controllers
 *
 * @example
 *
 *     loader.controllers(app);
 *
 * @method controllers
 * @param {Object} app Instance of express();
 */

exports.controllers = function (app) {
  //Load controllers

  load('controllers', function (filePath, fileName) {
    //Require controller
    var methods = require(filePath);
    //Load All Methods
    _.each(methods, function (ctrl, key) {
      //Check method
      if (ctrl.method) {
        if (ctrl.path) {
          var route = ctrl.path.replace(/:default/, fileName);
          app[ctrl.method.toLowerCase()](route + '.json', ctrl.fn);
          app[ctrl.method.toLowerCase()](route, ctrl.fn);
        } else {
          if (methods.index.fn) {
            //Set Default method
            app.get('/' + fileName + '.json', methods.index.fn);
            app.get('/' + fileName, methods.index.fn);
          }
          app[ctrl.method.toLowerCase()]('/' + fileName + '/' + key + '.json', ctrl.fn);
          app[ctrl.method.toLowerCase()]('/' + fileName + '/' + key, ctrl.fn);
        }
      } else {
        app.resource(fileName, methods, {
          format: 'json'
        });
      }
    });
  });

};
