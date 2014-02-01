[![Demi.js](logo.png)](http://demijs.enytc.com)

#Demi.js [![Build Status](https://secure.travis-ci.org/enytc/demi.png?branch=master)](http://travis-ci.org/enytc/demi) [![Dependency Status](https://gemnasium.com/enytc/demi.png)](https://gemnasium.com/enytc/demi) [![GH version](https://badge-me.herokuapp.com/api/gh/enytc/demi.png)](http://badges.enytc.com/for/gh/enytc/demi) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/enytc/demi/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

> An wonderful API framework for node.js

## Getting Started

1º Clone demi repo

```shell
git clone https://github.com/enytc/demi.git
```

2º Enter in demi directory
```shell
cd demi
```

3º Install dependencies

```shell
npm install
```

4º Configure the settings in `api/config`

5º Run demi

```shell
npm start
```

Test your demi app

```shell
npm test
```

##### Using Yeoman Generator

Install Demi.js generator

```shell
npm install -g generator-demi
```

Run Demi.js

```shell
yo demi
```

For more informations access this links.

NPM: [npm link](https://npmjs.org/package/generator-demi)
Repository: [generator-demi](https://github.com/chrisenytc/generator-demi)

## Documentation

### Controllers

How to use controllers

There are two kinds of controllers, each with a different purpose and operation.

##### Default Controller

The default controller is the model used to define routes based on `controller/action'

Conventions:

- The file name and the methods will be used on the route. e.g: tasks.js => `/` or `tasks / tasks / index`
- The default method always has to be the `index`
- If you want to override the route use the option: `path:' / newcustomroute / test '`
- Routes can optionally have a `.json` extension or without the extension. e.g: `/tasks/all.json` or `/tasks/all`
- All models can be found at: `global.models`. e.g: `global.models.Task`

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
   res.json(200, {
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
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * GET /tasks/new
   */

  new: function (req, res) {
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * POST /tasks
   */

  create: function (req, res) {
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * GET /tasks/:task
   */

  show: function (req, res) {
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * GET /tasks/:task/edit
   */

  edit: function (req, res) {
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * PUT /tasks/:task
   */

  update: function (req, res) {
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  },

  /*
   * DELETE /tasks/:task
   */

  destroy: function (req, res) {
    res.json(200, {
      welcome: 'Welcome to Demi API'
    });
  }
};
```

For more information see the documentation of the implementation of the restful Demi.js: [express-resource](https://npmjs.org/package/express-resource)

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

3º Declare and enable in `api/config/<env>/middlewares.json`

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

## Settings

How to use Settings

The Demi.js works with environments, you can have multiple configurations in your application.

The defaults environments are: `development`, `test` and `production`. You also create your own customized reports environments.

You can access the contents of environments using `app.get('nameofconfigfile')`

Conventions:

- The name of the configuration files in `app /config/<envs>` are the names used to get the contents of the settings in: `app.get ('nameofconfigfile')`

##### Custom Environments

How to create custom environments

1º Create `mycustomenv` folder in `api/config/`

2º Create config files in `api/config/mycustomenv`

3º Run your environment

```shell
NODE_ENV=mycustomenv node app
```

Example:

```shell
NODE_ENV=production node app
```

## Contributing

Please submit all issues and pull requests to the [enytc/demi](http://github.com/enytc/demi) repository!

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/enytc/demi/issues).

## License
Copyright (c) 2014 Christopher EnyTC

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
