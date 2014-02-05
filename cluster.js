/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

/**
 * Module dependencies.
 */

var os = require('os');
var cluster = require('cluster');
var debug = require('./lib/debugger.js');

/**
 * Cluster setup.
 */

// Setup the cluster to use app.js
cluster.setupMaster({
  exec: 'app.js'
});

// Listen for dying workers
cluster.on('exit', function (worker) {
  debug('Worker ' + worker.id + ' died', 'warming', 'cluster');
  // Replace the dead worker
  cluster.fork();
});

// Fork a worker for each available CPU
for (var i = 0; i < os.cpus().length; i++) {
  cluster.fork();
}
