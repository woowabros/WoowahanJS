const defaultTypeOptions = {
  required: false,
  defaultValue: null,
  min: null,
  max: null,
  format: null
};

const typeGenerator = (name, options) => Object.assign({ name: name }, defaultTypeOptions, options);

export default {
  String(options) {
    return typeGenerator('string', Object.assign({ defaultValue: '' }, options));
  },

  Number(options) {
    return typeGenerator('number', Object.assign({ defaultValue: 0 }, options));
  },

  Array(options) {
    return typeGenerator('array', Object.assign({ defaultValue: [] }, options))
  }
};