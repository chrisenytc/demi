/*
 * demi
 * https://github.com/chrisenytc/demi
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

/*
 * Module dependencies
 */
var Task = global.models.Task;

module.exports = {

  /*
   * RESOURCE tasks
   */

  index: function (req, res, next) {
    Task.find({}, function (err, tasks) {
      if (err) {
        next(err);
      }
      res.json(tasks);
    });
  },
  create: function (req, res, next) {
    var task = new Task(req.body);
    task.save(function (err) {
      if (err) {
        next(err);
      }
      //Send message
      res.json({
        message: 'Task created successfully',
        task: req.body
      });
    });
  },
  update: function (req, res, next) {
    Task.update({
      slug: req.params.task
    }, {
      $set: req.body
    }, function (err) {
      if (err) {
        next(err);
      }
      //Send message
      res.json({
        message: 'Task ' + req.params.task + ' updated successfully'
      });
    });
  },
  destroy: function (req, res, next) {
    Task.remove({
      slug: req.params.task
    }, function (err) {
      if (err) {
        next(err);
      }
      //Send message
      res.json({
        message: 'Task ' + req.params.task + ' removed successfully'
      });
    });
  }
};
