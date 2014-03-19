/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Taks Schema
 */
var TaskSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    closed: {
        type: Boolean,
        default: false
    }
});

//Exports model
module.exports = mongoose.model('Task', TaskSchema);
