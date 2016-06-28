import { assert } from 'chai';
import Woowahan from '../';

describe('Types', () => {
  describe('Create String Type', () => {
    it('Default Attributes', () => {
      let type = Woowahan.Types.String();

      assert.typeOf(type, 'object');
      assert.equal(type.name, 'string');
      assert.equal(type.defaultValue, '');
      assert.equal(type.required, false);
    });

    it('Set Required Attributes', () => {
      let type = Woowahan.Types.String({ required: true });

      assert.equal(type.required, true);
    });

    it('Set DefaultValue Attributes', () => {
      let defaultValue = 'Do Something';
      let type = Woowahan.Types.String({ defaultValue });

      assert.equal(type.defaultValue, defaultValue);
    });

    it('Set Min, Max Attributes', () => {
      let type = Woowahan.Types.String({ min: 4, max: 20 });

      assert.equal(type.min, 4);
      assert.equal(type.max, 20);
    });
  });

  describe('Create Number Type', () => {
    it('Default Attributes', () => {
      let type = Woowahan.Types.Number();

      assert.typeOf(type, 'object');
      assert.equal(type.name, 'number');
      assert.equal(type.defaultValue, 0);
      assert.equal(type.required, false);
    });

    it('Set Required Attributes', () => {
      let type = Woowahan.Types.Number({ required: true });

      assert.equal(type.required, true);
    });

    it('Set DefaultValue Attributes', () => {
      let defaultValue = 10;
      let type = Woowahan.Types.Number({ defaultValue });

      assert.equal(type.defaultValue, defaultValue);
    });

    it('Set Min, Max Attributes', () => {
      let type = Woowahan.Types.Number({ min: 4, max: 20 });

      assert.equal(type.min, 4);
      assert.equal(type.max, 20);
    });
  });

  describe('Create Array Type', () => {
    it('Default Attributes', () => {
      let type = Woowahan.Types.Array();

      assert.typeOf(type, 'object');
      assert.equal(type.name, 'array');
    });

    it('Set Required Attributes', () => {
      let type = Woowahan.Types.Array({ required: true });

      assert(type.required, true);
    });
  });

  describe('Create Email Type', () => {
    it('Default Attributes', () => {
      let type = Woowahan.Types.Email();

      assert.typeOf(type, 'object');
      assert.equal(type.name, 'email');
    });

    it('Set Required Attributes', () => {
      let type = Woowahan.Types.Email({ required: true });

      assert(type.required, true);
    });
  });
});