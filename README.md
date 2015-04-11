
Commandeer
==========

Proxy requests through [Connect][connect] and capture JSON responses before they are output.

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![io.js version support][shield-iojs]][info-iojs]
[![Build status][shield-build]][info-build]
[![Dependencies][shield-dependencies]][info-dependencies]
[![MIT licensed][shield-license]][info-license]

```js
var commandeer = require('commandeer');
var connect = require('connect');

var app = connect();

app.use(commandeer({
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    target: 'http://localhost:1234'
}));

app.use(function (request, response) {
    response.proxyData.commandeered = true;
    response.end(JSON.stringify(response.proxyData));
});

app.listen(3000);
```


Install
-------

Install Commandeer with [npm][npm]:

```sh
npm install commandeer
```


Getting Started
---------------

Require in [Connect][connect] and Commandeer:

```js
var commandeer = require('commandeer');
var connect = require('connect');
```

Create a Connect application:

```js
var app = connect();
```

Use the Commandeer middleware in your connect application, configuring it with a few [options](#options):

```js
app.use(commandeer({
    contentType: 'application/x-commandeer+json',
    dataProperty: 'proxyData',
    target: 'http://localhost:1234'
}));
```

Add another middleware after Commandeer to handle any JSON responses that are captured:

```js
app.use(function (request, response) {
    response.proxyData.commandeered = true;
    response.end(JSON.stringify(response.proxyData));
});
```

Start your Connect application:

```js
app.listen(3000);
```


Options
-------

#### `contentType` (string|array)

Any responses with a matching `Content-Type` header will not be proxied directly. Instead, the response body will be parsed as JSON and sent to the next middleware in the stack. E.g:

```js
app.use(commandeer({
    contentType: 'application/x-foo'
}));
app.use(function (request, response) {
    // Only responses from with a Content-Type of 'application/x-foo' will reach this middleware
});
```

If an array of strings is passed in, the response `Content-Type` will be checked against each of them:

```js
app.use(commandeer({
    contentType: [
        'application/x-foo',
        'application/x-bar'
    ]
}));
app.use(function (request, response) {
    // Only responses from with a Content-Type of 'application/x-foo' or 'application/x-bar' will reach this middleware
});
```

Defaults to `'application/x-commandeer+json'`.

#### `dataProperty` (string)

The JSON from captured responses will be stored on this property of the response. This property can be used to access the parsed JSON in the next middleware. E.g:

```js
app.use(commandeer({
    dataProperty: 'foo'
}));
app.use(function (request, response) {
    console.log(response.foo);
});
```

Defaults to `'proxyData'`.

#### `rewriteHostHeader` (boolean)

Whether to rewrite the `Host` header of proxied requests to match the target host. This is required for some back-ends to work properly.

Defaults to `true`.

#### `target` (string|function)

The proxy target for the application. This should point to your back-end application which can serve both regular responses and proxy data reponses to be captured by `Content-Type`.

If `target` is a function, it will be called with a request object which can be used to decide on a target. This function must return a string.

Defaults to `'http://localhost'`.


Examples
--------

Commandeer comes with a few example application/backend examples. To run these examples you'll need to install [Foreman][foreman], or look into the Procfiles for the examples and spin up each process separately.

#### Basic Example

Simple JSON transform. Commandeerable JSON has a new property added before output.

```
foreman start -d example/basic
```

#### Hogan.js Example

Render the JSON with a templating engine. Commandeerable JSON gets passed into [Hogan.js][hogan] to be rendered as a template.

```
foreman start -d example/hogan
```

#### Multiple Backends Example

Proxying to multiple backends from the same application, by using a target function rather than a string.

```
foreman start -d example/multiple-backends
```


Contributing
------------

To contribute to Commandeer, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
make lint test
```


License
-------

Commandeer is licensed under the [MIT][info-license] license.  
Copyright &copy; 2015, Rowan Manning



[connect]: https://github.com/senchalabs/connect
[foreman]: https://github.com/ddollar/foreman
[hogan]: https://github.com/twitter/hogan.js
[npm]: https://npmjs.org/

[info-dependencies]: https://gemnasium.com/rowanmanning/commandeer
[info-iojs]: package.json
[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/commandeer
[info-build]: https://travis-ci.org/rowanmanning/commandeer
[shield-dependencies]: https://img.shields.io/gemnasium/rowanmanning/commandeer.svg
[shield-iojs]: https://img.shields.io/badge/io.js%20support-latest-brightgreen.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/node/v/commandeer.svg?label=node.js+support
[shield-npm]: https://img.shields.io/npm/v/commandeer.svg
[shield-build]: https://img.shields.io/travis/rowanmanning/commandeer/master.svg
