# bugnet

Capture Javascript errors. Minimal version of [rollbar], [bugsnag], etc.

![build status](http://img.shields.io/travis/metalabdesign/bugnet/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/metalabdesign/bugnet/master.svg?style=flat)
![license](http://img.shields.io/npm/l/bugnet.svg?style=flat)
![version](http://img.shields.io/npm/v/bugnet.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/bugnet.svg?style=flat)

## Usage

Simply pass the function you wish to use for being notified of errors. As soon as you include `bugnet` in your application errors will start to be captured and buffered until they're ready to be consumed later. It is recommended you include `bugnet` as soon as possible in your application.

Importantly `bugnet` will **NOT** squelch your application errors (i.e. not a silent `catch`-all) - it simply monitors them.

```sh
npm install --save bugnet
```

```javascript
import capture from 'bugnet';

capture((error) => {
	// ...
});
```

### Examples

#### Browser

Send browser errors to an off-site logger:

```javascript
import capture from 'bugnet';

// Add event handler.
capture((error) => {
	const request = new XMLHttpRequest();
	request.open('http://errors.myapp.com/', 'POST', true);
	request.send(JSON.stringify(event));
});
```

#### Node

Send node.js errors to the console:

```javascript
// example.js
import capture from 'bugnet';

// Add event handler.
capture((error) => {
	console.log('Got error', error);
});
```

To start capturing errors at the earliest possible point, load `bugnet` from `node` itself.

```sh
#!/bin/sh
node -r bugnet ./example.js
```

## TODO:

 * Testing
 * Fix incompatibilities using `Object.*` methods

[rollbar]: https://rollbar.com/
[bugsnag]: https://bugsnag.com/
