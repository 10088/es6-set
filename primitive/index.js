'use strict';

var clear       = require('es5-ext/object/clear')
  , callable    = require('es5-ext/object/valid-callable')
  , d           = require('d/d')
  , ee          = require('event-emitter/lib/core')
  , getIterator = require('es6-iterator/get')
  , forOf       = require('es6-iterator/for-of')
  , Iterator    = require('./_iterator')

  , isArray = Array.isArray, call = Function.prototype.call
  , create = Object.create, defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , Set, values;

module.exports = Set = function (/*iterable*/) {
	var iterable = arguments[0];
	if (!(this instanceof Set)) return new Set(iterable);
	if (this.__setData__ !== undefined) {
		throw new TypeError(this + " cannot be reinitialized");
	}
	if (iterable != null) {
		if (!isArray(iterable)) iterable = getIterator(iterable);
	}
	defineProperties(this, {
		__setData__: d('', create(null)),
		__size__: d('w', 0)
	});
	if (!iterable) return;
	forOf(iterable, function (value) { this.add(value); }, this);
};

ee(defineProperties(Set.prototype, {
	constructor: d(Set),
	_serialize: d(String),
	add: d(function (value) {
		var key = this._serialize(value);
		if (hasOwnProperty.call(this.__setData__, key)) return this;
		this.__setData__[key] = value;
		++this.__size__;
		this.emit('_add', key);
		return this;
	}),
	clear: d(function () {
		clear(this.__setData__);
		this.__size__ = 0;
		this.emit('_clear');
	}),
	delete: d(function (value) {
		var key = this._serialize(value);
		if (!hasOwnProperty.call(this.__setData__, key)) return false;
		delete this.__setData__[key];
		--this.__size__;
		this.emit('_delete', key);
		return true;
	}),
	entries: d(function () { return new Iterator(this, 'key+value'); }),
	forEach: d(function (cb/*, thisArg*/) {
		var thisArg = arguments[1], iterator, result;
		callable(cb);
		iterator = this.values();
		result = iterator.next();
		while (!result.done) {
			call.call(cb, thisArg, result.value, result.value, this);
			result = iterator.next();
		}
	}),
	has: d(function (value) {
		var key = this._serialize(value);
		return hasOwnProperty.call(this.__setData__, key);
	}),
	keys: d(values = function () { return new Iterator(this); }),
	size: d.gs(function () { return this.__size__; }),
	values: d(values),
	'@@iterator': d(values),
	toString: d(function () { return '[object Set]'; })
}));