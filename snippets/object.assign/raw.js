'use strict';

var objectKeys = Object.keys;
var $Object = Object;
var $push = Function.call.bind(Array.prototype.push);
var $propIsEnumerable = Function.call.bind(Object.prototype.propertyIsEnumerable);

function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }
  if (typeof Symbol.iterator === 'symbol') {
    return true;
  }

  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);
  if (typeof sym === 'string') {
    return false;
  }

  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  }

  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  }
  if (objectKeys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }

  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }

  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }

  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }

  return true;
}

var implementation = function assign(target, source1) {
  if (target == null) {
    throw new TypeError('target must be an object');
  }
  var to = $Object(target);
  if (arguments.length === 1) {
    return to;
  }
  for (var s = 1; s < arguments.length; ++s) {
    var from = $Object(arguments[s]);
    var keys = objectKeys(from);
    var getSymbols = hasSymbols() && $Object.getOwnPropertySymbols;
    if (getSymbols) {
      var syms = getSymbols(from);
      for (var j = 0; j < syms.length; ++j) {
        var key = syms[j];
        if ($propIsEnumerable(from, key)) {
          $push(keys, key);
        }
      }
    }

    for (var i = 0; i < keys.length; ++i) {
      var nextKey = keys[i];
      if ($propIsEnumerable(from, nextKey)) {
        var propValue = from[nextKey];
        to[nextKey] = propValue;
      }
    }
  }

  return to;
};

var lacksProperEnumerationOrder = function () {
  if (!Object.assign) {
    return false;
  }
  var str = 'abcdefghijklmnopqrst';
  var letters = str.split('');
  var map = {};
  for (var i = 0; i < letters.length; ++i) {
    map[letters[i]] = letters[i];
  }
  var obj = Object.assign({}, map);
  var actual = '';
  for (var k in obj) {
    actual += k;
  }
  return str !== actual;
};

var assignHasPendingExceptions = function () {
  if (!Object.assign || !Object.preventExtensions) {
    return false;
  }
  var thrower = Object.preventExtensions({ 1: 2 });
  try {
    Object.assign(thrower, 'xy');
  } catch (e) {
    return thrower[1] === 'y';
  }
  return false;
};

var getPolyfill = function getPolyfill() {
  if (!Object.assign) {
    return implementation;
  }
  if (lacksProperEnumerationOrder()) {
    return implementation;
  }
  if (assignHasPendingExceptions()) {
    return implementation;
  }
  return Object.assign;
};

var shim = function shimAssign() {
  var polyfill = getPolyfill();
  if (typeof Object.defineProperty === 'function') {
    Object.defineProperty(Object, 'assign', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: polyfill
    });
  } else {
    Object.assign = polyfill;
  }
  return polyfill;
};

var polyfill = getPolyfill();
var bound = function assign(target, source1) {
  return polyfill.apply(Object, arguments);
};

if (typeof Object.defineProperty === 'function') {
  Object.defineProperty(bound, 'getPolyfill', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: getPolyfill
  });
  Object.defineProperty(bound, 'implementation', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: implementation
  });
  Object.defineProperty(bound, 'shim', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: shim
  });
} else {
  bound.getPolyfill = getPolyfill;
  bound.implementation = implementation;
  bound.shim = shim;
}

module.exports = bound;
