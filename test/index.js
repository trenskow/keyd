'use strict';

import keyPath from '../index.js';

import { expect } from 'chai';
import merge from '@trenskow/merge';

let obj = { this: { is: { a: { value: 1 } } } };
let arr = [
	{ this: { is: { a: [{ value: 1 }, { value: 2 }] } } },
	{ this: { is: { a: [{ value: 3 }, { value: 4 }] } } },
];

const test = (options = {}) => {

	const convert = (str) => {
		return str.split('.').join((options || {}).separator || '.');
	};

	describe(`separator: ${options.separator || 'default'}`, () => {

		describe('get', () => {

			it ('should come back with value', () => {
				expect(keyPath(obj).get(convert('this.is.a.value'), merge({}, options))).to.equal(1);
			});

			it ('should come back with undefined', () => {
				expect(keyPath(obj).get(convert('this.is.not.a.value'), merge({}, options))).to.equal(undefined);
			});

		});

		describe('set', () => {

			it ('should set value (creating intermediate objects), return the object and read it back', () => {
				obj = keyPath(obj).set(convert('this.is.a.new.value'), true, merge({}, options)).result;
				expect(keyPath(obj).get(convert('this.is.a.new.value'), merge({}, options))).to.equal(true);
			});

			it ('should modify original object', () => {
				expect(obj.this.is.a.new.value).to.equal(true);
			});

			it ('should not allow prototype overwrite', () => {
				expect(keyPath(obj).set('__proto__.polluted', true).result.__proto__.polluted).to.be.equal(undefined);
				expect(keyPath(obj).set('constructor.prototype.polluted', true).result.constructor.prototype.polluted).to.be.equal(undefined);
			});

		});

		describe('delete', () => {

			it ('should delete value, return the object and read it back.', () => {
				let obj = { this: { is: { a: { value: 1 }, another: { value: 2 } } } };
				keyPath(obj).delete('this.is.another');
				expect(keyPath(obj).get('this.is.another.value')).to.be.equal(undefined);
			});

		});

		describe('get (array)', () => {

			it ('should come back with all items', () => {
				expect(keyPath(arr).get(convert('this.is.a.value'), merge({}, options))).to.deep.equal([1,2,3,4]);
			});

			it ('should come back with length', () => {
				expect(keyPath(arr).get('0.this.is.a.length', { arrays: 'flat' })).to.equal(2);
			});

		});

		describe('exists', () => {

			it ('should come back with `true`', () => {
				expect(keyPath(obj).exists('this.is.a.value')).to.be.true;
			});

			it ('should come back with `false`', () => {
				expect(keyPath(obj).exists('this.is.a.value.1')).to.be.false;
			});

		});

		describe('keyPaths', () => {

			it ('should come back with an array of all key paths.', () => {
				expect(keyPath(obj).keyPaths()).to.eql([
					'this',
					'this.is',
					'this.is.a',
					'this.is.a.value',
					'this.is.a.new',
					'this.is.a.new.value',
					'polluted'
				]);
			});

			it ('should come back with an array of all key paths where values are the same.', () => {
				expect(keyPath({
					id: 0,
					test: {
						id: 0
					}
				}).keyPaths()).to.eql(['id', 'test', 'test.id']);
			});

		});

		describe('utils', () => {
			it ('should throw an error if components are fed with non-string.', () => {
				expect(() => { keyPath.components(['a', 'key', 'ath']); }).to.throw(Error, '`keyPath` must be a string.');
			});

			it ('should come back with components.', () => {
				expect(keyPath.components(convert('this.is.a.key.path'), merge({}, options))).to.be.an('Array').with.lengthOf(5);
			});

			it ('should come back with an empty components.', () => {
				expect(keyPath.components('', merge({}, options))).to.be.an('Array').with.lengthOf(0);
			});

			it ('should join key path.', () => {
				expect(keyPath.join(['this','is','a','key','path'], merge({}, options))).to.equal(convert('this.is.a.key.path'));
			});

			it ('should throw an error if input is not an array when joining.', () => {
				expect(() => { keyPath.join(convert('this.is.a.key.path'), merge({}, options)); }).to.throw(Error, '`components` must be an array.');
			});

			it ('should append a key.', () => {
				expect(keyPath.append(convert('this.is.a.key'), 'path', merge({}, options))).to.equal(convert('this.is.a.key.path'));
			});

			it ('should come back with the last component.', () => {
				expect(keyPath.last(convert('this.is.a.key.path'), merge({}, options))).to.equal('path');
			});

			it ('should come back without the last component removed.', () => {
				expect(keyPath.eatLast(convert('this.is.a.key.path'), merge({}, options))).to.equal(convert('this.is.a.key'));
			});

			it ('should come back with the first component.', () => {
				expect(keyPath.first(convert('this.is.a.key.path'), merge({}, options))).to.equal('this');
			});

			it ('should come back with the first component removed.', () => {
				expect(keyPath.eatFirst(convert('this.is.a.key.path'), merge({}, options))).to.equal(convert('is.a.key.path'));
			});

			it ('should come back with the first component of other key path removed.', () => {
				expect(keyPath.eatFirst(convert('this.is.a.key.path'), convert('this.is.a'), merge({}, options))).to.equal(convert('key.path'));
			});

			it ('should throw an error when eating key path is not within key path.', () => {
				expect(() => { keyPath.eatFirst(convert('this.is.a.key.path'), convert('this.is.another'), merge({}, options)); }).to.throw(Error, '`eat` is not with key path.');
			});

			it ('should come back with the depth of the key path.', () => {
				expect(keyPath.depth(convert('this.is.a.key.path'), merge({}, options))).to.equal(5);
			});

			it ('should come back with `false` if key path is not within another.', () => {
				expect(keyPath.within(convert('this.is.my.first.path'), convert('this.is.my.second'), merge({}, options))).to.equal(false);
			});

			it ('should come back with `true` if key path is within another', () => {
				expect(keyPath.within(convert('this.is.my'), convert('this.is.my.second'), merge({}, options))).to.equal(true);
			});

			it ('should come back with `true` if key path is equal to another', () => {
				expect(keyPath.within(convert('this.is.my'), convert('this.is.my'), merge({}, options))).to.equal(true);
			});

			it ('should come back with `false` if key path is longer than another', () => {
				expect(keyPath.within(convert('this.is.my.first.key.path'), convert('this.is.my'), merge({}, options))).to.equal(false);
			});

			it ('should come back with `true` if key path is equal to another', () => {
				expect(keyPath.is(convert('this.is.my.key.path'), convert('this.is.my.key.path'), merge({}, options))).to.equal(true);
			});

			it ('should come back with `false` if key path is not equal to another', () => {
				expect(keyPath.is(convert('this.is.my.key.path'), convert('this.is.not.my.key.path'), merge({}, options))).to.equal(false);
			});

			it ('should come back with all the keys in an object', () => {
				expect(keyPath({ a: 123, b: { c: 456, d: { e: 789, f: 'abc' } }}).keyPaths(merge({}, options)))
					.to.have.members(['a', 'b', convert('b.c'), convert('b.d'), convert('b.d.e'), convert('b.d.f')]);
			});

			it ('should come back with all the keys in an object (with specific depth)', () => {
				expect(keyPath({ a: 123, b: { c: 456, d: { e: 789, f: 'abc' } }}).keyPaths(merge({ depth: 0 }, merge({}, options))))
					.to.have.members(['a', 'b']);
			});

			it ('should come back with all the keys in an object (without any ds)', () => {
				expect(keyPath({ a: 123, b: { c: 456, d: { e: 789, f: 'abc' } }}).keyPaths(merge({ tester: (keyPath) => {
					return keyPath.indexOf('d') == -1;
				}}, options))).to.have.members(['a', 'b', convert('b.c'), convert('b.d')]);
			});

			it ('should ignore arrays', () => {
				expect(keyPath({ a: [123,456] }).keyPaths(merge({}, options))).to.have.members(['a']);
			});

			it ('should not traverse circular references', () => {
				let a = {};
				let b = { test: '123', a: a };
				a.b = b;
				expect(keyPath(a).keyPaths()).to.eql([ 'b', 'b.test', 'b.a' ]);
			});

		});

	});

};

test();
test({ separator: '.' });
test({ separator: ':' });
