'use strict';

function KeyPath(obj) {

	if (!(this instanceof KeyPath)) return new KeyPath(obj);

	Object.defineProperty(this, 'keyPaths', {
		get: function() {

			const keys = (obj, keyPath = []) => {
				if (!obj || typeof obj === 'string') return [];
				return [].concat(...Object.keys(obj).map((key) => {
					const newKeyPath = keyPath.concat([key]);
					return [newKeyPath.join('.')].concat(...keys(obj[key], newKeyPath));
				}));
			};

			return keys(obj);

		}
	});

	this.get = function(keyPath) {

		if (!Array.isArray(keyPath)) {
			keyPath = components(keyPath);
		}

		let ret = obj;

		for (let idx = 0 ; idx < keyPath.length ; idx++) {
			ret = (ret || {})[keyPath[idx]];
		}

		return ret;

	};

	this.getAll = function(keyPath) {

		const resolve = function(obj, keyPath) {

			if (keyPath.length == 0) return obj;

			if (!Array.isArray(obj)) obj = [obj];

			let items = obj.map((obj) => {
				let ret = obj[keyPath[0]];
				if (!Array.isArray(ret)) ret = [ret];
				return ret;
			}).reduce((res, item) => {
				return res.concat(item);
			}, []);

			return resolve(items, keyPath.slice(1));

		};

		return resolve(obj, keyPath.split('.'));

	};

	this.set = function(keyPath, value) {

		if (!Array.isArray(keyPath)) {
			keyPath = keyPath.split('.').filter(key => key.length > 0);
		}

		let ret = obj;

		for (let idx = 0 ; idx < keyPath.length - 1 ; idx++) {
			ret = ret[keyPath[idx]] = ret[keyPath[idx]] || {};
		}

		ret[keyPath[keyPath.length - 1]] = value;

	};

}

module.exports = exports = KeyPath;

function components(keyPath) {
	return (keyPath || '').split('.').filter((part) => part);
}

exports.components = components;

function join(components) {
	components = components || [];
	return components.join('.');
}

exports.join = join;

function depth(keyPath) {
	return components(keyPath).length;
}

exports.depth = depth;

function append(keyPath, keys) {
	if (!Array.isArray(keys)) keys = [keys];
	return join(components(keyPath).concat(keys));
}

exports.append = append;

function last(keyPath) {
	let parts = components(keyPath);
	return parts[parts.length - 1];
}

exports.last = last;

function eatLast(keyPath) {
	return join(components(keyPath).slice(0, -1));
}

exports.eatLast = eatLast;

function first(keyPath) {
	return components(keyPath)[0];
}

exports.first = first;

function eatFirst(keyPath) {
	return join(components(keyPath).slice(1));
}

exports.eatFirst = eatFirst;

function within(first, second) {
	const firstComponents = components(first);
	const secondComponents = components(second);
	if (firstComponents.length > secondComponents.length) return false;
	return !firstComponents.some((firstComponent, idx) => {
		return firstComponent !== secondComponents[idx];
	});
}

exports.within = within;
