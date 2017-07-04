
module.exports = {
  create(schemaName, defineSchema) {
    const Schema = {
      wwtype: 'schema',
      schemaName
    };

    function mixedDataWithSchema(data) {
      let schema = {};

      for (let key in defineSchema) {
        if (defineSchema.hasOwnProperty(key)) {
          schema[key] = void 0;
        }
      }

      return Object.assign(schema, data);
    }

    Schema.validate = function(data) {
      const mixedData = mixedDataWithSchema(data);

      let errors = [];
      
      for(let key in mixedData) {
        if (mixedData.hasOwnProperty(key)) {
          let type = defineSchema[key];

          if (type && type.hasOwnProperty('__validate__')) {
            let error = type.__validate__.call(type, key, data[key]);
            if (error) errors.push(error);
          } else {
            typeof window === 'object' && console.warn(`Is not defined in the schema field "${key}" is present.`);
          }
        }
      }

      return errors.length === 0 ? void 0 : errors;
    };

    Schema.toSchema = function() {
      return defineSchema;
    };

    return Schema;
  }
};
