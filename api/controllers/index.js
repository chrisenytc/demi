/*
 * demi
 * https://github.com/chrisenytc/demi
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {

  /*
   * GET /
   */

  index: function (req, res) {
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  }
};
