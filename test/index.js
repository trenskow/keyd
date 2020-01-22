'use strict';

const keypath = require('../'),
	expect = require('chai').expect;

let obj = { this: { is: { a: { value: 1 } } } };
let arr = [
	{ this: { is: { a: [{ value: 1 }, { value: 2 }] } } },
	{ this: { is: { a: [{ value: 3 }, { value: 4 }] } } },
];

it ('should come back with value', () => {
	expect(keypath(obj).get('this.is.a.value')).to.equal(1);
});

it ('should come back with undefined', () => {
	expect(keypath(obj).get('this.is.not.a.value')).to.equal(undefined);
});

it ('should set value (creating intermediate objects) and read it back', () => {
	keypath(obj).set('this.is.a.new.value', true);
	expect(keypath(obj).get('this.is.a.new.value')).to.equal(true);
});

it ('should modify original object', () => {
	expect(obj.this.is.a.new.value).to.equal(true);
});

it ('should come back with all items', () => {
	expect(keypath(arr).getAll('this.is.a.value')).to.deep.equal([1,2,3,4]);
});

it ('should come back with components.', () => {
	expect(keypath.components('this.is.a.key.path')).to.be.an('Array').with.lengthOf(5);
});

it ('should come back with an empty components.', () => {
	expect(keypath.components('')).to.be.an('Array').with.lengthOf(0);
});

it ('should join key path.', () => {
	expect(keypath.join(['this','is','a','key','path'])).to.equal('this.is.a.key.path');
});

it ('should append a key.', () => {
	expect(keypath.append('this.is.a.key', 'path')).to.equal('this.is.a.key.path');
});

it ('should come back with the last component.', () => {
	expect(keypath.last('this.is.a.key.path')).to.equal('path');
});

it ('should come back without the last component removed.', () => {
	expect(keypath.eatLast('this.is.a.key.path')).to.equal('this.is.a.key');
});

it ('should come back with the first component.', () => {
	expect(keypath.first('this.is.a.key.path')).to.equal('this');
});

it ('should come back with the first component removed.', () => {
	expect(keypath.eatFirst('this.is.a.key.path')).to.equal('is.a.key.path');
});
