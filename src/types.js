const Error = require('./error');

const TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  ARRAY: 'array',
  EMAIL: 'email',
  PHONE: 'phone'
};
const REQUIRED = 'required';
const DEFAULT_VALUE = 'defaultValue';
const MIN = 'min';
const MAX = 'max';
const FORMAT = 'format';

const defaultTypeOptions = {};
const partialValidator = {};

const validator = function(key, value) {
  if (REQUIRED in this && !partialValidator[REQUIRED].call(this, value)) {
    return Error.create(`Required attribute "${key}" is missing.`, { key, value });
  }

  if (value === void 0) return;

  // Data type checking
  if (!partialValidator[this.name].call(this, value)) {
    return Error.create(`"${key}" type property must be "${this.name}".`, { key, value });
  }

  if (this.name === TYPE.NUMBER) {
    if (MIN in this && this[MIN] !== null && !partialValidator[MIN].call(this, value)) {
      return Error.create(`"${key}" is greater than ${this[MIN]}.`, { key, value });
    }

    if (MAX in this && this[MAX] !== null && !partialValidator[MAX].call(this, value)) {
      return Error.create(`"${key}" may have a value of ${this[MAX]} or less.`, { key, value });
    }
  } else if (this.name === TYPE.STRING) {
    if (MIN in this && this[MIN] !== null && !partialValidator[MIN].call(this, value)) {
      return Error.create(`"${key}" must be more than ${this[MIN]} characters long.`, { key, value });
    }

    if (MAX in this && this[MAX] !== null && !partialValidator[MAX].call(this, value)) {
      return Error.create(`"${key}" should be no longer than ${this[MAX]} characters.`, { key, value });
    }
  }
};

const typeGenerator = function(name, supportOptions, options) {
  let defaults = {}, type;

  supportOptions.forEach(option => {
    defaults[option] = defaultTypeOptions[option];
  });

  type = _.assign({ name: name }, defaults, options);
  type.__validate__ = validator;

  return type;
};

defaultTypeOptions[REQUIRED] = false;
defaultTypeOptions[DEFAULT_VALUE] = null;
defaultTypeOptions[MIN] = null;
defaultTypeOptions[MAX] = null;
defaultTypeOptions[FORMAT] = null;

partialValidator[TYPE.STRING] = function(value) {
  return typeof value === TYPE.STRING;
};

partialValidator[TYPE.NUMBER] = function(value) {
  if (typeof value === 'number') return true;

  let stringType = String(value);
  let match = stringType.match(/^[+-]?(\d+\.?\d*)$|(\d*\.?\d+)$/g);

  if (!match) return false;
  if (match.length > 1) return false;

  return (match[0].length === stringType.length);
};

partialValidator[TYPE.ARRAY] = function(value) {
  return Array.isArray(value);
};

partialValidator[TYPE.EMAIL] = function(value) {
  var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(value);
};

partialValidator[REQUIRED] = function(value) {
  if (this[REQUIRED]) return value !== void 0 && value !== null;
  return true;
};

partialValidator[MIN] = function(value) {
  if (this.name === TYPE.NUMBER) {
    return value >= this[MIN];
  } else if (this.name === TYPE.STRING) {
    return value.length >= this[MIN];
  }
  return true;
};

partialValidator[MAX] = function(value) {
  if (this.name === TYPE.NUMBER) {
    return value <= this[MAX];
  } else if (this.name === TYPE.STRING) {
    return value.length <= this[MAX];
  }
  return true;
};

module.exports = {
  String(options) {
    return typeGenerator(TYPE.STRING, [
      REQUIRED,
      DEFAULT_VALUE,
      MIN,
      MAX,
      FORMAT
    ], _.assign({ defaultValue: '' }, options));
  },

  Number(options) {
    return typeGenerator(TYPE.NUMBER, [
      REQUIRED,
      DEFAULT_VALUE,
      MIN,
      MAX
    ], _.assign({ defaultValue: 0 }, options));
  },

  Array(options) {
    return typeGenerator(TYPE.ARRAY, [
      REQUIRED,
      DEFAULT_VALUE
    ], _.assign({ defaultValue: [] }, options));
  },

  Email(options) {
    return typeGenerator(TYPE.EMAIL, [
      REQUIRED
    ], _.assign({}, options));
  }
};