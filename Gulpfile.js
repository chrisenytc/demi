/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var stylish = require('jshint-stylish');

gulp.task('jshint', function () {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(['./api/**/*.js', './lib/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Copy all static images
gulp.task('mocha', function () {
  return gulp.src('./test/*.js')
    .pipe(mocha({
      globals: ['chai'],
      timeout: 6000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    }));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(['./api/**/*.js', './lib/**/*.js', './test/**/*.js'], ['jshint']);
});

gulp.task('test', function () {
  gulp.run('mocha', function () {
    process.exit(0);
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['jshint', 'mocha', 'watch']);
