/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

var gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    serve = require('gulp-serve'),
    uncss = require('gulp-uncss'),
    rimraf = require('gulp-rimraf');


//Make files
gulp.task('make', function() {
  gulp.src('src/css/**/*.css')
    .pipe(gulp.dest('build/css'));
  gulp.src('src/fancybox/**/*')
    .pipe(gulp.dest('build/fancybox'));
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('build/js'));
  gulp.src('src/img/**/*.png')
    .pipe(gulp.dest('build/img'));
  gulp.src('src/*.txt')
    .pipe(gulp.dest('build'));
});

//Html minify
gulp.task('minify', function() {
  gulp.src('src/html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
});

//Html minify
gulp.task('minify-views', function() {
  gulp.src('src/views/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/views'));
});

//Remove unused css
gulp.task('uncss', function() {
    gulp.src('src/css/layouts/demi.css')
        .pipe(uncss({
            html: ['src/**/*.html']
        }))
        .pipe(gulp.dest('build/css'));
});

//Clean build
gulp.task('clean', function() {
    gulp.src('build', {read: false})
        .pipe(rimraf({force: true}));
});

//Clean ghpage
gulp.task('clean-ghpage', function() {
    gulp.src(['css', 'js', 'img', 'views'], {read: false})
        .pipe(rimraf({force: true}));
    gulp.src('*.html', {read: false})
        .pipe(rimraf({force: true}));
    gulp.src('*.txt', {read: false})
        .pipe(rimraf({force: true}));
});


//Serve files
gulp.task('serve', serve({
    root: ['build', '.'],
    port: 3000,
    middleware: function(req, res, next) {
        // custom optional middleware
        next();
    }
}));

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch('src/html/*.html', ['minify']);
  gulp.watch('src/views/*.html', ['minify-views']);
  gulp.watch('src/css/*.css', ['make']);
  gulp.watch('src/js/*.js', ['make']);
});

//build site
gulp.task('build', ['clean-ghpage', 'make', 'uncss', 'minify', 'minify-views']);

//support for github page
gulp.task('ghpage', function() {

  gulp.src('src/css/**/*.css')
    .pipe(gulp.dest('css'));
  gulp.src('src/fancybox/**/*')
    .pipe(gulp.dest('fancybox'));
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('js'));
  gulp.src('src/img/**/*.png')
    .pipe(gulp.dest('img'));
  gulp.src('src/*.txt')
    .pipe(gulp.dest(''));

  gulp.src('src/html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(''));

  gulp.src('src/views/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('views'));

  gulp.src('src/css/layouts/demi.css')
        .pipe(uncss({
            html: ['src/**/*.html']
        }))
        .pipe(gulp.dest('css'));

  gulp.run('clean');
});

//support for live preview
gulp.task('start', ['serve', 'build', 'watch']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);
