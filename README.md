keyd
----

A small library for using and manipulating key path in JavaScript.

## Installation

````bash
npm install --save keyd
````

## Getting / Setting Values

````javascript
const keyd = require('keyd');
````
    
### Getting Values

````javascript
keyd(obj).get('my.keypath');
````

#### Getting values in array and sub-arrays.

````javascript
keyd(obj).getAll('my.keypath');
````

### Setting Values

````javascript
keyd(obj).set('my.keypath', value);
````

## Manipulating Key Paths

### Components

````javascript
const components = keyd.components('my.key.path');
/* -> ['my','key','path'] */
````

### Joining

````javascript
const keyPath = keyd.join(['my','key','path']);
/* -> 'my.key.path' */
````

### Appending Keys

````javascript
const keyPath = keyd.append('my.key', 'path');
/* -> 'my.key.path' */
````

or

````javascript
const keyPath = keyd.append('my', ['key', 'path']);
/* -> 'my.key.path' */
````

### Last

#### Getting

````javascript
const lastComponent = keyd.last('my.key.path');
/* -> 'path' */
````

#### Removing

````javascript
const keyPath = keyd.eatLast('my.key.path');
/* -> 'my.key' */
````

### First

#### Getting

````javascript
const firstComponent = keyd.first('my.key.path');
/* -> 'my' */
````

#### Removing

````javascript
const keyPath = keyd.eatFirst('my.key.path');
/* -> 'key.path' */
````

### Match

````javascript
const within = keyd.within('my.key.path', 'my.key');
/* -> true */
````

## License

MIT (see LICENSE).

# The end
