# keyd
-----
Modify objects using key paths.

## Installation

````bash
npm install keyd
````

## Usage

````javascript
const keyd = require('keyd');
````
    
### Getting Values

````javascript
keyd(myobj).get('my.keypath');
````

#### Getting values in array and subarrays.

````javascript
keyd(myobj).getAll('my.keypath');
````

### Setting Values

````javascript
keyd(myobj).set('my.keypath', value);
````

## The end