'use strict';

var numberIsNaN = function (value) {
  return value !== value;
};

var implementation = function is(a, b) {
  if (a === 0 && b === 0) {
    return 1 / a === 1 / b;
  }
  if (a === b) {
    return true;
  }
  if (numberIsNaN(a) && numberIsNaN(b)) {
    return true;
  }
  return false;
};

var getPolyfill = function getPolyfill() {
  return typeof Object.is === 'function' ? Object.is : implementation;
};

var shim = function shimObjectIs() {
  var polyfill = getPolyfill();
  if (typeof Object.defineProperty === 'function') {
    Object.defineProperty(Object, 'is', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: polyfill
    });
  } else {
    Object.is = polyfill;
  }
  return polyfill;
};

var polyfill = getPolyfill();
polyfill.getPolyfill = getPolyfill;
polyfill.implementation = implementation;
polyfill.shim = shim;

module.exports = polyfill;
