# keyd
-----
Modify objects using key paths.

## Installation

    npm install keyd

## Usage

    const keyd = require('keyd');
    
### Getting Values

    keyd(myobj).get('my.keypath');

#### Getting values in array and subarrays.

    keyd(myobj).getAll('my.keypath');
    
### Setting Values

    keyd(myobj).set('my.keypath', value);

## The end