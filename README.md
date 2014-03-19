[![Demi.js](logo.png)](http://demijs.enytc.com)

#Demi.js [![Build Status](https://secure.travis-ci.org/enytc/demi.png?branch=master)](http://travis-ci.org/enytc/demi) [![Dependency Status](https://gemnasium.com/enytc/demi.png)](https://gemnasium.com/enytc/demi) [![GH version](https://badge-me.herokuapp.com/api/gh/enytc/demi.png)](http://badges.enytc.com/for/gh/enytc/demi) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/enytc/demi/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

> An wonderful API framework for node.js

## Getting Started

1º Clone demi repo

```bash
git clone https://github.com/enytc/demi.git
```

2º Enter in demi directory
```bash
cd demi
```

3º Install dependencies

```bash
npm install
```

4º Configure the settings in `api/config`

5º Run demi

```bash
npm start
```

Test your demi app

```bash
npm test
```

##### Using Yeoman Generator

Install Demi.js generator

```bash
npm install -g generator-demi
```

Run Demi.js

```bash
yo demi
```

###### Learn to use the Demi.js generator

[![Demo](https://raw2.github.com/enytc/demi/gh-pages/src/img/howtouse-play.png)](http://ascii.io/a/7507/)

For more informations access this links.

NPM: [npm link](https://npmjs.org/package/generator-demi)
Repository: [generator-demi](https://github.com/chrisenytc/generator-demi)

## Documentation

### Overview

Demi.js can work with HTTP or HTTPS. You can simply switch the settings in your enviroment.

**INFO** To use htps you need to generate or have a key and a certificate. e.g: `cert.pem` and `key.pem`

You can rename the files in `api/config/<env>/ssl.json`.

[How to generate a ssl cert](http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/)

[How to generate a ssl cert with pem](http://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server)

Example:

Edit: `api/config/<env>/app.json`

```json
{
  "https": true
}
```

#### Params to Demi.js constructor

**Parameter**: `version`
**Type**: `String`
**Example**: `v1`

**Parameter**: `options`
**Type**: `Object`
**Example**:
```javascript
{
 http: {
  port: 80,
  options: {}
  },
 https: {
  port: 403,
  options: {}
  }
}
```

**options** are options that can be passed optionally to connect to database using mongoose.

### Versioning

You can make many versions of your API. Every new instance of the API you can pass a string with the version and it will start this instance.

Example:

```javascript
var demi = require('./lib/demi.js');
var api1 = api('v1');
var api2 = api('v2');
```
All requests must be made using the routes /v1 and /v2


### Controllers

How to use controllers

There are two kinds of controllers, each with a different purpose and operation.

##### Default Controller

The default controller is the model used to define routes based on `controller/action'

Conventions:

- The file name and the methods will be used on the route. e.g: tasks.js => `/` or `tasks/tasks/index`
- The default method always has to be the `index`
- If you want to override the route use the option: `path:'/newcustomroute/test '`
- Routes can optionally have a `.json` extension or without the extension. e.g: `/tasks/all.json` or `/tasks/all`
- All models can be found at: `global.models`. e.g: `global.models.Task`
- All configurations can be found at: `global.configs`. e.g: `global.configs.app`

Example:

```javascript

var Model = global.models.Model;

module.exports = {

 /*
  * GET /
  */

 index: {
  method: 'GET',
  path: '/newcustomroute',
  fn: function (req, res) {
   res.jsonpp(200, {
    message: 'Request received successfully!'
   });
  }
 }
};

```

##### Restful Controller

The restful controller is responsible for providing restful routes following the model of restful applications.

Example:

```javascript
module.exports = {

  /*
   * GET /tasks
   */

  index: function (req, res) {
    res.jsonpp(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * GET /tasks/new
   */

  new: function (req, res) {
    res.jsonp(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * POST /tasks
   */

  create: function (req, res) {
    res.jsonp(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * GET /tasks/:task
   */

  show: function (req, res) {
    res.jsonp(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * GET /tasks/:task/edit
   */

  edit: function (req, res) {
    res.jsonp(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * PUT /tasks/:task
   */

  update: function (req, res) {
    res.jsonp(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * DELETE /tasks/:task
   */

  destroy: function (req, res) {
    res.jsonp(200, {
      welcome: 'Welcome to Demi API'
    });
  }
};
```

## Models

How to use Models

The models in demi.js uses the mongoose and follows the implementation of the example below:

```javascript
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
```

## Middlewares

How to use middlewares

You can add and manage middlewares very easily in Demi.js and may activate it or deactivate it very easily and quickly.

The middleware Demi.js follow the format below:

```javascript
module.exports = {

  /*
   * Set true if you want enable this middleware
   */
  enabled: false,
  fn: function () {
    return function (req, res, next) {
      //console.log('Called');
      next();
    };
  }
};
```

##### Shared Middlewares

You can create or use shared middlewares by the community Demi.js on NPM.

###### Using shared middlewares

1º Search for middlewares in `https://npmjs.org/search?q=demi-` or `http://demijs.enytc.com/#/middlewares`

2º Install middleware `npm install demi-example --save`

3º Declare and enable in `api/config/<env>/middlewares.jsonp`

Example:

```json
[
  {
    "enabled": true,
    "name": "demi-example"
  }
]

```

Now your shared middlewares are ready to be used.

###### Creating your Demi.js middlewares

The middlewares of Demi.js are exactly the same as the middlewares of  Express.js but just need to follow some conventions.

Conventions:

- The name of the middleware must always start with `demi-`. e.g: `demi-example`.
- The middleware should be sent to NPM.
- The middlewares must have the tag `demiddleware`.

Following these conventions your middleware may appear in Demi.js site, so you can help many people.

Example:

```javascript
/*
 * demi-example
 * https://github.com/chrisenytc/demi-example
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function () {
  return function (req, res, next) {
    //console.log('Called');
    next();
};

```

## Services

How to use services

Services are specific to provide static JSON files can be accessed via: `/ws/nameofjsonfile.json`

Conventions:

- All services are on route `/ws/`
- The name of the JSON file will be used as the name of the route. e.g: `/ws/nameofjsonfile`
- Routes can use the `.json` extension optionally. e.g: `/ws/nameofjsonfile.json`

The services accept any valid JSON.

Example:

```json
[
  {
    "name": "Bella"
  },
  {
    "name": "Livia"
  }
]
```

## Sockets

How to use Sockets

The Demi.js uses socket.io, you need to follow some conventions to able to use it.

1. The file name and the method name will be used as socket path. e.g: `test.js` + `index` = `test/index`
2. You can listen or emit a message using that path. e.g: `on: function(data){}` or `emit: 'message-example'`
3. `this` variable has the scope of socket.io and can use all of its methods. e.g: `this.on('test/index', function(data){});`, `this.emit('test/index', 'message-example')` and more.

Example:

`api/sockets/test.js`

```javascript
module.exports = {

  /*
   * SOCKET test
   */

  index: {
    on: function(data) {
      //show received data
      console.log(data);
      //emit new data
      this.emit('test/another/event', data);
    },
    emit: 'test this'
  }
};
```

For more information see the documentation of socket.io:

[How to use Socket.io](http://socket.io/#how-to-use)

## Settings

How to use Settings

The Demi.js works with environments, you can have multiple configurations in your application.

The defaults environments are: `development`, `test` and `production`. You also create your own customized reports environments.

You can access the contents of environments using `app.get('nameofconfigfile')`

Conventions:

- The name of the configuration files in `app/config/<envs>` are the names used to get the contents of the settings in: `app.get('nameofconfigfile')`

##### Custom Environments

How to create custom environments

1º Create `mycustomenv` folder in `api/config/`

2º Create config files in `api/config/mycustomenv`

3º Run your environment

```bash
NODE_ENV=mycustomenv node app
```

Example:

```bash
NODE_ENV=production node app
```

## Contributing

See the [CONTRIBUTING Guidelines](CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/enytc/demi/issues).

## License

The BSD License

Copyright (c) 2014, EnyTC Corporation

All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the EnyTC Corporation nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
