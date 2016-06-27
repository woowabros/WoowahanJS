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
        if (this.schema[key] && this.schema[key].hasOwnProperty('__validate__')) {
          this.schema[key].__validate__.call(this.schema[key], key, data[key]);
        } else {
          console.warn(`Is not defined in the schema field "${key}" is present.`);
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
