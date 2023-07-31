'use strict';

const keyd = function KeyPath(obj) {

	if (!(this instanceof KeyPath)) return new KeyPath(obj);

	Object.defineProperty(this, 'result', {
		get: function() {
			return obj;
		}
	});

	this.keyPaths = function(options = {}) {

		if (typeof options.depth !== 'number') options.depth = Infinity;
		options.separator = options.separator || '.';

		const handled = [];

		const keys = (obj, keyPath = [], level = 0) => {
			if (level > options.depth) return [];
			if (level > 0 && options.tester && !options.tester(join(keyPath, options), obj)) return [];
			if (!obj || typeof obj !== 'object' || (options.allowArrays !== true && Array.isArray(obj))) return [];
			return [].concat(...Object.keys(obj).map((key) => {
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					if (handled.findIndex((item) => item === obj[key]) > -1) return [];
					handled.push(obj[key]);
				}
				const newKeyPath = keyPath.concat([key]);
				return [join(newKeyPath, options)].concat(...keys(obj[key], newKeyPath, level + 1));
			}));
		};

		return keys(obj);

	};

	this.get = function(keyPath, options = { separator: '.', arrays: 'combine' }) {

		keyPath = _unfold(keyPath, options);

		const current = keyPath[0];
		const next = keyPath.slice(1);

		if (typeof obj === 'undefined') return;
		
		if (Array.isArray(obj) && (options || {}).arrays !== 'flat') {
			return obj = obj
				.reduce((result, item) => [result, keyd(item).get(keyPath, options)].flat(), []);
		}

		if (typeof current !== 'undefined') return keyd(obj[current]).get(next, options);

		return obj;

	};

	this.set = function(keyPath, value, options = { separator: '.' }) {

		keyPath = _unfold(keyPath, options);

		let ret = obj;

		for (let idx = 0 ; idx < keyPath.length - 1 ; idx++) {
			if (['__proto__', 'constructor', 'prototype'].includes(keyPath[idx])) continue;
			ret = ret[keyPath[idx]] = ret[keyPath[idx]] || {};
		}

		if (keyPath.length > 0) ret[keyPath[keyPath.length - 1]] = value;

		return this;

	};

	this.delete = function(keyPath, options = { separator: '.'}) {

		keyPath = _unfold(keyPath, options);

		let ret = obj;

		for (let idx = 0 ; idx < keyPath.length - 1 ; idx++) {
			if (['__proto__', 'constructor', 'prototype'].includes(keyPath[idx])) continue;
			if (this.keyPaths.length > 0 && typeof ret[keyPath[idx]] !== 'object') return this;
			ret = ret[keyPath[idx]] = ret[keyPath[idx]] || {};
		}

		if (keyPath.length > 0) delete ret[keyPath[keyPath.length - 1]];

		return this;

	};

	this.exists = function(keyPath, options = { separator: '.' }) {

		const [exists] = _unfold(keyPath, options)
			.reduce(([exists, obj], key) => {
				return [
					exists && typeof obj === 'object' && key in obj,
					(obj || {})[key]
				];
			}, [true, obj]);

		return exists;

	};

	this.present = function(keyPath, options = { separator: '.' }) {

		const resolve = function(result, obj, pastKeyPath, futureKeyPath) {

			if (futureKeyPath.length == 0) {
				return result.concat(join(pastKeyPath, options));
			}

			if (Array.isArray(obj)) {

				return obj.reduce((result, item, idx) => {
					return resolve(result, item, pastKeyPath.concat(idx), futureKeyPath);
				}, result);

			} else {

				if (typeof obj[futureKeyPath[0]] === 'undefined') return result;

				return resolve(result, obj[futureKeyPath[0]], pastKeyPath.concat(futureKeyPath[0]), futureKeyPath.slice(1));

			}

		};

		return resolve([], obj, [], _unfold(keyPath, options));

	};

};

module.exports = exports = keyd;

function components(keyPath, options = {}) {
	if (typeof keyPath !== 'string') throw new Error('`keyPath` must be a string.');
	return (keyPath || '').split(options.separator || '.').filter((part) => part);
}

exports.components = components;

function _unfold(keyPath, options) {
	// If key path is not an array - we get the components of it.
	if (!Array.isArray(keyPath)) return components(keyPath, options);
	// - otherwise we copy it.
	return keyPath.slice();
}

function join(components, options = {}) {
	if (!Array.isArray(components)) throw new Error('`components` must be an array.');
	return _unfold(components || []).join(options.separator || '.');
}

exports.join = join;

function depth(keyPath, options = { separator: '.' }) {
	return _unfold(keyPath, options).length;
}

exports.depth = depth;

function append(keyPath, keys, options = { separator: '.' }) {
	return join(_unfold(keyPath, options).concat(_unfold(keys, options)), options);
}

exports.append = append;

function last(keyPath, options = { separator: '.' }) {
	let parts = _unfold(keyPath, options);
	return parts[parts.length - 1];
}

exports.last = last;

function eatLast(keyPath, options = { separator: '.' }) {
	return join(_unfold(keyPath, options).slice(0, -1), options);
}

exports.eatLast = eatLast;

function first(keyPath, options = { separator: '.' }) {
	return _unfold(keyPath, options)[0];
}

exports.first = first;

function eatFirst(keyPath, eat, options = { separator: '.' }) {

	if (typeof eat === 'object') {
		options = eat;
		eat = undefined;
	}

	// If components are not provided, we just take the first value.
	if (!eat) eat = first(keyPath, options);

	keyPath = _unfold(keyPath, options);
	eat = _unfold(eat, options);

	if (!within(eat, keyPath, options)) {
		throw new Error('`eat` is not with key path.');
	}

	// As long as there are components left that match we eat it.
	while (eat.length > 0) {
		if (keyPath[0] === eat[0]) {
			keyPath = keyPath.slice(1);
			eat = eat.slice(1);
		} else {
			break;
		}
	}

	return join(keyPath, options);

}

exports.eatFirst = eatFirst;

function within(first, second, options = { separator: '.' }) {

	first = _unfold(first, options);
	second = _unfold(second, options);

	if (first.length > second.length) return false;
	return !first.some((component, idx) => {
		return component !== second[idx];
	});

}

exports.within = within;

function is(first, second, options = { separator: '.' }) {

	first = _unfold(first, options);
	second = _unfold(second, options);

	if (first.length !== second.length) return false;
	return first.every((component, idx) => {
		return component === second[idx];
	});

}

exports.is = is;
