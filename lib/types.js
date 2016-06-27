const REQUIRED = 'required';
const DEFAULT_VALUE = 'defaultValue';
const MIN = 'min';
const MAX = 'max';
const FORMAT = 'format';

var defaultTypeOptions = {};
var partialValidator = {};

defaultTypeOptions[REQUIRED] = false;
defaultTypeOptions[DEFAULT_VALUE] = null;
defaultTypeOptions[MIN] = null;
defaultTypeOptions[MAX] = null;
defaultTypeOptions[FORMAT] = null;

partialValidator[REQUIRED] = function(key, value) {
  if (this[REQUIRED]) return value !== void 0;
  return true;
};

/*
 } else {
 console.error(`"${key}" will only allow numeric values.`);
 return false;
 */
partialValidator[MIN] = function(key, value) {
  if (this.name === 'number') {
    return value >= this[MIN];
  } else if (this.name === 'string') {
    return value.length >= this[MIN];
  }
  return true;
};

partialValidator[MAX] = function(key, value) {
  if (this.name === 'number') {
    return value <= this[MAX];
  } else if (this.name === 'string') {
    return value.length <= this[MAX];
  }
  return true;
};

function validator(key, value) {
  if (this[REQUIRED] && !partialValidator[REQUIRED].call(this, key, value)) {
    console.error(`Required attribute "${key}" is missing.`);
    return false;
  }

  if (this[MIN] && !partialValidator[MIN].call(this, key, value)) {
    if (this.name === 'number') {
      console.error(`"${key}" is greater than ${this[MIN]}.`);
    } else {
      console.error(`"${key}" must be more than ${this[MIN]}${this[MIN]} characters long.`);
    }
    return false;
  }
  return true;
}

function typeGenerator(name, supportOptions, options) {
  let defaults = {}, type;

  supportOptions.forEach(option => {
    defaults[option] = defaultTypeOptions[option];
  });

  type = Object.assign({ name: name }, defaults, options);
  type.__validate__ = validator;

  return type;
}

module.exports = {
  String(options) {
    return typeGenerator('string', [
      REQUIRED,
      DEFAULT_VALUE,
      MIN,
      MAX,
      FORMAT
    ], Object.assign({ defaultValue: '' }, options));
  },

  Number(options) {
    return typeGenerator('number', [
      REQUIRED,
      DEFAULT_VALUE,
      MIN,
      MAX
    ], Object.assign({ defaultValue: 0 }, options));
  },

  Array(options) {
    return typeGenerator('array', [
      REQUIRED,
      DEFAULT_VALUE
    ], Object.assign({ defaultValue: [] }, options))
  }
};