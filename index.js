'use strict';

module.exports = exports = function KeyPath(obj) {

	if (!(this instanceof KeyPath)) return new KeyPath(obj);

	this.get = function(keypath) {

		if (!Array.isArray(keypath)) {
			keypath = (keypath || '').split('.').filter(key => key.length > 0);
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
