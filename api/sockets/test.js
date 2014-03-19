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
     * SOCKET test
     */

    index: {
        on: function (data) {
            console.log(data);
            this.emit('test/index', data);
        },
        emit: 'test this'
    }
};
