'use strict';

var hasSymbols = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
  if (typeof Symbol.iterator === 'symbol') { return true; }

  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);
  if (typeof sym === 'string') { return false; }
  if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

  var symVal = 42;
  obj[sym] = symVal;
  for (var _ in obj) { return false; }
  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }
  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) { return false; }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
  }

  return true;
};

var hasToStringTag = hasSymbols() && !!Symbol.toStringTag;
var has = Function.call.bind(Object.prototype.hasOwnProperty);
var $exec = Function.call.bind(RegExp.prototype.exec);
var $toString = Function.call.bind(Object.prototype.toString);
var isRegexMarker;
var badStringifier;

if (hasToStringTag) {
  isRegexMarker = {};

  var throwRegexMarker = function () {
    throw isRegexMarker;
  };
  badStringifier = {
    toString: throwRegexMarker,
    valueOf: throwRegexMarker
  };

  if (typeof Symbol.toPrimitive === 'symbol') {
    badStringifier[Symbol.toPrimitive] = throwRegexMarker;
  }
}

var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';

module.exports = hasToStringTag
  ? function isRegex(value) {
    if (!value || typeof value !== 'object') {
      return false;
    }

    var descriptor = gOPD(value, 'lastIndex');
    var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
    if (!hasLastIndexDataProperty) {
      return false;
    }

    try {
      $exec(value, badStringifier);
    } catch (e) {
      return e === isRegexMarker;
    }
  }
  : function isRegex(value) {
    if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
      return false;
    }

    return $toString(value) === regexClass;
  };
