/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

module.exports = {

  /*
   * Set true if you want enable this middleware
   */
  enabled: true,
  fn: function () {
    return function (req, res, next) {
      //
      next();
    };
  }
};
