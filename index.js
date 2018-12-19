'use strict';

module.exports = exports = function KeyPath(obj) {

	if (!(this instanceof KeyPath)) return new KeyPath(obj);

	this.get = function(keypath) {

		if (!Array.isArray(keypath)) {
			keypath = (keypath || '').split('.').filter(key => key.length > 0);
		}

		if (keypath.length === 1 && keypath[0] === '') {
			keypath = [];
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

};
