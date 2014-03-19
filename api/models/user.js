/*
 * demi
 * https://github.com/enytc/demi
 *
 * Copyright (c) 2014 EnyTC Corporation
 * Licensed under the BSD license.
 */

'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


/*
 * Validators
 */
var nameValidator = [validate('len', 1)];
var usernameValidator = [validate('len', 1), validate('isAlphanumeric')];
var emailValidator = [validate('len', 1), validate('isEmail')];
var passwordValidator = [validate('len', 8)];

/*
 * Setters
 */

function hashed(val) {
    if ('string' != typeof val) val = '';
    return crypto.createHash('sha1').update(val).digest('hex');
}

/*
 * User Schema
 */
var UserSchema = new Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        validate: nameValidator
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: usernameValidator
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: emailValidator
    },
    token: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
        set: hashed,
        validate: passwordValidator
    },
    role: {
        type: String,
        trim: true,
        default: 'user'
    },
    status: {
        type: Boolean,
        default: false
    }
});

/*
 * Plugins
 */
UserSchema.plugin(timestamps);

//Exports model
var User = module.exports = mongoose.model('User', UserSchema);

UserSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('email')) {
        User.findOne({
            email: this.email
        }, function (err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                return next(new Error('This email already exists!'));
            }
            return next();
        });
    } else {
        return next();
    }
});

UserSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('username')) {
        User.findOne({
            username: this.username
        }, function (err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                return next(new Error('This username already exists!'));
            }
            return next();
        });
    } else {
        return next();
    }
});
