'use strict';

const keyPath = require('../'),
	expect = require('chai').expect;

let obj = { this: { is: { a: { value: 1 } } } };
let arr = [
	{ this: { is: { a: [{ value: 1 }, { value: 2 }] } } },
	{ this: { is: { a: [{ value: 3 }, { value: 4 }] } } },
];

it ('should come back with value', () => {
	expect(keyPath(obj).get('this.is.a.value')).to.equal(1);
});

it ('should come back with undefined', () => {
	expect(keyPath(obj).get('this.is.not.a.value')).to.equal(undefined);
});

it ('should set value (creating intermediate objects), return the object and read it back', () => {
	obj = keyPath(obj).set('this.is.a.new.value', true).result;
	expect(keyPath(obj).get('this.is.a.new.value')).to.equal(true);
});

it ('should modify original object', () => {
	expect(obj.this.is.a.new.value).to.equal(true);
});

it ('should come back with all items', () => {
	expect(keyPath(arr).getAll('this.is.a.value')).to.deep.equal([1,2,3,4]);
});

it ('should come back with components.', () => {
	expect(keyPath.components('this.is.a.key.path')).to.be.an('Array').with.lengthOf(5);
});

it ('should come back with an empty components.', () => {
	expect(keyPath.components('')).to.be.an('Array').with.lengthOf(0);
});

it ('should join key path.', () => {
	expect(keyPath.join(['this','is','a','key','path'])).to.equal('this.is.a.key.path');
});

it ('should append a key.', () => {
	expect(keyPath.append('this.is.a.key', 'path')).to.equal('this.is.a.key.path');
});

it ('should come back with the last component.', () => {
	expect(keyPath.last('this.is.a.key.path')).to.equal('path');
});

it ('should come back without the last component removed.', () => {
	expect(keyPath.eatLast('this.is.a.key.path')).to.equal('this.is.a.key');
});

it ('should come back with the first component.', () => {
	expect(keyPath.first('this.is.a.key.path')).to.equal('this');
});

it ('should come back with the first component removed.', () => {
	expect(keyPath.eatFirst('this.is.a.key.path')).to.equal('is.a.key.path');
});

it ('should come back with the depth of the key path.', () => {
	expect(keyPath.depth('this.is.a.key.path')).to.equal(5);
});

it ('should come back with `false` if key path is not within another.', () => {
	expect(keyPath.within('this.is.my.first.path', 'this.is.my.second')).to.equal(false);
});

it ('should come back with `true` if key path is within another', () => {
	expect(keyPath.within('this.is.my', 'this.is.my.second')).to.equal(true);
});

it ('should come back with `true` if key path is equal to another', () => {
	expect(keyPath.within('this.is.my', 'this.is.my')).to.equal(true);
});

it ('should come back with `false` if key path is longer than another', () => {
	expect(keyPath.within('this.is.my.first.key.path', 'this.is.my')).to.equal(false);
});

it ('should come back with all the keys in an object', () => {
	expect(keyPath({
		a: 123,
		b: {
			c: 456,
			d: {
				e: 789,
				f: 'abc'
			}
		}
	}).keyPaths).to.have.members(['a', 'b', 'b.c', 'b.d', 'b.d.e', 'b.d.f']);
});

it ('should ignore arrays', () => {
	expect(keyPath({
		a: [123,456]
	}).keyPaths).to.have.members(['a']);
});