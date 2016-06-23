var Types = require('./types');

module.exports = {
  create(schemaName, defineSchema) {
    let Schema = function(schema) {
      this.schema = schema;
    };

    Schema.wwtype = 'schema';
    Schema.schemaName = schemaName;

    Schema.prototype.validate = function(data) {
      let validateData = this.toMasterObject(data);

      for(let key in validateData) {
        if (this.schema[key] && this.schema[key].hasOwnProperty('__validate')) {
          this.schema[key].__validate.call(this.schema[key], key, data[key]);
        } else {
          console.warn(`스키마에 정의되지 않은 필드 "${key}"이 존재합니다.`);
        }
      }
    };

    Schema.prototype.toMasterObject = function(data) {
      let schema = {};

      for (let key in this.schema) schema[key] = void 0;

      return Object.assign(schema, data);
    };

    Schema.prototype.toString = () => '[Object Woowahan.Schema]';

    return new Schema(defineSchema);
  }
};
