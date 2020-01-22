'use strict';

function KeyPath(obj) {

	if (!(this instanceof KeyPath)) return new KeyPath(obj);

	this.get = function(keypath) {

		if (!Array.isArray(keypath)) {
			keypath = components(keypath);
		}

		let ret = obj;

		for (let idx = 0 ; idx < keypath.length ; idx++) {
			ret = (ret || {})[keypath[idx]];
		}

		return ret;

	};

	this.getAll = function(keypath) {

		const resolve = function(obj, keypath) {

			if (keypath.length == 0) return obj;

			if (!Array.isArray(obj)) obj = [obj];

			let items = obj.map((obj) => {
				let ret = obj[keypath[0]];
				if (!Array.isArray(ret)) ret = [ret];
				return ret;
			}).reduce((res, item) => {
				return res.concat(item);
			}, []);

			return resolve(items, keypath.slice(1));

		};

		return resolve(obj, keypath.split('.'));

	};

	this.set = function(keypath, value) {

		if (!Array.isArray(keypath)) {
			keypath = keypath.split('.').filter(key => key.length > 0);
		}

		let ret = obj;

		for (let idx = 0 ; idx < keypath.length - 1 ; idx++) {
			ret = ret[keypath[idx]] = ret[keypath[idx]] || {};
		}

		ret[keypath[keypath.length - 1]] = value;

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

function append(keyPath, keys) {
	if (!Array.isArray(keys)) keys = [keys];
	return components(keyPath).concat(keys).join('.');
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
