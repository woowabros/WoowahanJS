const defaultTypeOptions = {
  required: false,
  defaultValue: null,
  min: null,
  max: null,
  format: null
};

const typeGenerator = (name, options) => Object.assign({ name: name }, defaultTypeOptions, options);

module.exports = {
  String(options) {
    let type = typeGenerator('string', Object.assign({ defaultValue: '' }, options));

    type.__validate = function(key, value) {
      if (this.required && (value === void 0 || value === null)) {
        console.error(`필수 입력 속성 "${key}"가 누락되었습니다.`)
        return false;
      }

      return true;
    };

    return type;
  },

  Number(options) {
    return typeGenerator('number', Object.assign({ defaultValue: 0 }, options));
  },

  Array(options) {
    return typeGenerator('array', Object.assign({ defaultValue: [] }, options))
  }
};