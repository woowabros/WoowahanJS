'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Error = require('./error');

var TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  ARRAY: 'array',
  EMAIL: 'email',
  PHONE: 'phone'
};
var REQUIRED = 'required';
var DEFAULT_VALUE = 'defaultValue';
var MIN = 'min';
var MAX = 'max';
var FORMAT = 'format';

var defaultTypeOptions = {};
var partialValidator = {};

var validator = function validator(key, value) {
  if (REQUIRED in this && !partialValidator[REQUIRED].call(this, value)) {
    return Error.create('Required attribute "' + key + '" is missing.', { key: key, value: value });
  }

  if (value === void 0) return;

  // Data type checking
  if (!partialValidator[this.name].call(this, value)) {
    return Error.create('"' + key + '" type property must be "' + this.name + '".', { key: key, value: value });
  }

  if (this.name === TYPE.NUMBER) {
    if (MIN in this && this[MIN] !== null && !partialValidator[MIN].call(this, value)) {
      return Error.create('"' + key + '" is greater than ' + this[MIN] + '.', { key: key, value: value });
    }

    if (MAX in this && this[MAX] !== null && !partialValidator[MAX].call(this, value)) {
      return Error.create('"' + key + '" may have a value of ' + this[MAX] + ' or less.', { key: key, value: value });
    }
  } else if (this.name === TYPE.STRING) {
    if (MIN in this && this[MIN] !== null && !partialValidator[MIN].call(this, value)) {
      return Error.create('"' + key + '" must be more than ' + this[MIN] + ' characters long.', { key: key, value: value });
    }

    if (MAX in this && this[MAX] !== null && !partialValidator[MAX].call(this, value)) {
      return Error.create('"' + key + '" should be no longer than ' + this[MAX] + ' characters.', { key: key, value: value });
    }
  }
};

var typeGenerator = function typeGenerator(name, supportOptions, options) {
  var defaults = {},
      type = void 0;

  supportOptions.forEach(function (option) {
    defaults[option] = defaultTypeOptions[option];
  });

  type = Object.assign({ name: name }, defaults, options);
  type.__validate__ = validator;

  return type;
};

defaultTypeOptions[REQUIRED] = false;
defaultTypeOptions[DEFAULT_VALUE] = null;
defaultTypeOptions[MIN] = null;
defaultTypeOptions[MAX] = null;
defaultTypeOptions[FORMAT] = null;

partialValidator[TYPE.STRING] = function (value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === TYPE.STRING;
};

partialValidator[TYPE.NUMBER] = function (value) {
  if (typeof value === 'number') return true;

  var stringType = String(value);
  var match = stringType.match(/^[+-]?(\d+\.?\d*)$|(\d*\.?\d+)$/g);

  if (!match) return false;
  if (match.length > 1) return false;

  return match[0].length === stringType.length;
};

partialValidator[TYPE.ARRAY] = function (value) {
  return Array.isArray(value);
};

partialValidator[TYPE.EMAIL] = function (value) {
  var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(value);
};

partialValidator[REQUIRED] = function (value) {
  if (this[REQUIRED]) return value !== void 0 && value !== null;
  return true;
};

partialValidator[MIN] = function (value) {
  if (this.name === TYPE.NUMBER) {
    return value >= this[MIN];
  } else if (this.name === TYPE.STRING) {
    return value.length >= this[MIN];
  }
  return true;
};

partialValidator[MAX] = function (value) {
  if (this.name === TYPE.NUMBER) {
    return value <= this[MAX];
  } else if (this.name === TYPE.STRING) {
    return value.length <= this[MAX];
  }
  return true;
};

module.exports = {
  String: function String(options) {
    return typeGenerator(TYPE.STRING, [REQUIRED, DEFAULT_VALUE, MIN, MAX, FORMAT], Object.assign({ defaultValue: '' }, options));
  },
  Number: function Number(options) {
    return typeGenerator(TYPE.NUMBER, [REQUIRED, DEFAULT_VALUE, MIN, MAX], Object.assign({ defaultValue: 0 }, options));
  },
  Array: function Array(options) {
    return typeGenerator(TYPE.ARRAY, [REQUIRED, DEFAULT_VALUE], Object.assign({ defaultValue: [] }, options));
  },
  Email: function Email(options) {
    return typeGenerator(TYPE.EMAIL, [REQUIRED], Object.assign({}, options));
  }
};