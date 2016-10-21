'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
  create: function create(schemaName, defineSchema) {
    var Schema = {
      wwtype: 'schema',
      schemaName: schemaName
    };

    function mixedDataWithSchema(data) {
      var schema = {};

      for (var key in defineSchema) {
        schema[key] = void 0;
      }return Object.assign(schema, data);
    }

    Schema.validate = function (data) {
      var errors = [];

      for (var key in mixedDataWithSchema(data)) {
        var type = defineSchema[key];

        if (type && type.hasOwnProperty('__validate__')) {
          var error = type.__validate__.call(type, key, data[key]);
          if (error) errors.push(error);
        } else {
          (typeof windows === 'undefined' ? 'undefined' : _typeof(windows)) === 'object' && console.warn('Is not defined in the schema field "' + key + '" is present.');
        }
      }
      return errors.length === 0 ? void 0 : errors;
    };

    Schema.toSchema = function () {
      return defineSchema;
    };

    return Schema;
  }
};