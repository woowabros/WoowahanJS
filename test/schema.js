import { assert } from 'chai';
import Woowahan from '../';

describe('Schema & Validation:', () => {
  let defaultSchema = Woowahan.Schema.create('defaultSchema', {
    name: Woowahan.Types.String(),
    age: Woowahan.Types.Number()
  });

  let attrsSchema = Woowahan.Schema.create('attrsSchema', {
    name: Woowahan.Types.String({ required: true }),
    age: Woowahan.Types.Number({ min: 18, max: 120 }),
    email: Woowahan.Types.Email()
  });

  it('Set woowahan type (wwtype) name', () => {
    assert.equal(defaultSchema.wwtype, 'schema');
  });

  it('Set schema name', () => {
    assert.equal(defaultSchema.schemaName, 'defaultSchema');
  });

  it('Check required attribute', () => {
    assert.lengthOf(attrsSchema.validate({}), 1);
  });

  it('Check string data ', () => {
    assert.equal(defaultSchema.validate({ name: 'kim' }), void 0);
    assert.lengthOf(defaultSchema.validate({ name: 1 }), 1);
  });

  it('Check invalide number data', () => {
    assert.lengthOf(defaultSchema.validate({ name: 'kim', age: '10살' }), 1);
  });

  it('Check valide string number data', () => {
    assert.equal(defaultSchema.validate({ name: 'kim', age: '30' }), void 0);
    assert.equal(defaultSchema.validate({ name: 'kim', age: '+30' }), void 0);
    assert.lengthOf(defaultSchema.validate({ name: 'kim', age: '30.1 343' }), 1);
    assert.lengthOf(defaultSchema.validate({ name: 'kim', age: '30.1.343' }), 1);
  });

  it('Check min value for number type', () => {
    assert.equal(attrsSchema.validate({ name: 'kim', age: 25 }), void 0);
    assert.equal(attrsSchema.validate({ name: 'kim', age: '25' }), void 0);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: 10 }), 1);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: '10' }), 1);
  });

  it('Check max value for number type', () => {
    assert.equal(attrsSchema.validate({ name: 'kim', age: 20 }), void 0);
    assert.equal(attrsSchema.validate({ name: 'kim', age: '20' }), void 0);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: 145 }), 1);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: '145' }), 1);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: '-145' }), 1);
  });

  it('Multiple validation', () => {
    assert.lengthOf(attrsSchema.validate({ age: 200 }), 2);
  });

  it('Check valide email', () => {
    assert.equal(attrsSchema.validate({ name: 'kim', age: 30, email: 'your.name@company.com' }), void 0);
    assert.equal(attrsSchema.validate({ name: 'kim', age: 30, email: 'your-name@company.kr' }), void 0);
    assert.equal(attrsSchema.validate({ name: 'kim', age: 30, email: 'yourname@company.co.kr' }), void 0);
  });

  it('Check invalide email', () => {
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: 30, email: '@company.com' }), 1);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: 30, email: 'company.com' }), 1);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: 30, email: '@@test' }), 1);
    assert.lengthOf(attrsSchema.validate({ name: 'kim', age: 30, email: 'foo' }), 1);
  });
});