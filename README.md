
Commandeer
==========

Proxy requests through [Connect][connect] and capture JSON responses before they are output.

**Current Version:** *0.0.0*  
**Node Support:** *0.10.x, 0.12.x*  
**License:** [MIT][mit]  
**Build Status:** [![Build Status][travis-img]][travis]

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

### `contentType` (string)

Any responses with a matching `Content-Type` header will not be proxied directly. Instead, the response body will be parsed as JSON and sent to the next middleware in the stack. E.g:

```js
app.use(commandeer({
    contentType: 'application/x-foo'
}));
app.use(function (request, response) {
    // Only responses from with a Content-Type of 'application/x-foo' will reach this middleware
});
```

Defaults to `'application/x-commandeer+json'`.

### `dataProperty` (string)

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

### `target` (string)

The proxy target for the application. This should point to your back-end application which can serve both regular responses and proxy data reponses to be captured by `Content-Type`.

Defaults to `'http://localhost'`.


Examples
--------

Commandeer comes with a few example application/backend examples. To run these examples you'll need to install [Foreman][foreman], or look into the Procfiles for the examples and spin up each process separately.

### Basic example with simple JSON transform

```
foreman start -d example/basic
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

Commandeer is licensed under the [MIT][mit] license.  
Copyright &copy; 2015, Rowan Manning



[connect]: https://github.com/senchalabs/connect
[foreman]: https://github.com/ddollar/foreman
[mit]: LICENSE
[npm]: https://npmjs.org/
[travis]: https://travis-ci.org/rowanmanning/commandeer
[travis-img]: https://travis-ci.org/rowanmanning/commandeer.svg?branch=master
