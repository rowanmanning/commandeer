
Commandeer
==========

Proxy requests through connect and capture JSON responses before they are output.

**Current Version:** *0.0.0*  
**Node Support:** *0.10.x, 0.12.x*  
**License:** [MIT][mit]  
**Build Status:** [![Build Status][travis-img]][travis]


Install
-------

Install Commandeer with [npm][npm]:

```sh
npm install commandeer
```


Usage
-----

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

app.listen(5678);
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



[mit]: LICENSE
[npm]: https://npmjs.org/
[travis]: https://travis-ci.org/rowanmanning/commandeer
[travis-img]: https://travis-ci.org/rowanmanning/commandeer.svg?branch=master
