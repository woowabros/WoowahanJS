import chai from 'chai';
import Woowahan from '../';

chai.should();

describe('Types', () => {
  describe('Create String Type', () => {
    it('Default Attributes', done => {
      let stringType = Woowahan.Types.String();

      stringType.should.be.an('object');
      stringType.name.should.equal('string');
      stringType.defaultValue.should.equal('');
      stringType.required.should.equal(false);

      done();
    });

    it('Set Required Attributes', done => {
      let stringType = Woowahan.Types.String({ required: true });

      stringType.required.should.equal(true);

      done();
    });

    it('Set DefaultValue Attributes', done => {
      let defaultValue = 'Do Something';
      let stringType = Woowahan.Types.String({ defaultValue });

      stringType.defaultValue.should.equal(defaultValue);

      done();
    });

    it('Set Min, Max Attributes', done => {
      let stringType = Woowahan.Types.String({ min: 4, max: 20 });

      stringType.min.should.equal(4);
      stringType.max.should.equal(20);

      done();
    });
  });

  describe('Create Number Type', () => {
    it('Default Attributes', done => {
      let numberType = Woowahan.Types.Number();

      numberType.should.be.an('object');
      numberType.name.should.equal('number');
      numberType.defaultValue.should.equal(0);
      numberType.required.should.equal(false);

      done();
    });

    it('Set Required Attributes', done => {
      let numberType = Woowahan.Types.Number({ required: true });

      numberType.required.should.equal(true);

      done();
    });

    it('Set DefaultValue Attributes', done => {
      let defaultValue = 10;
      let numberType = Woowahan.Types.Number({ defaultValue });

      numberType.defaultValue.should.equal(defaultValue);

      done();
    });

    it('Set Min, Max Attributes', done => {
      let numberType = Woowahan.Types.Number({ min: 4, max: 20 });

      numberType.min.should.equal(4);
      numberType.max.should.equal(20);

      done();
    });
  });

  describe('Create Array Type', () => {
    it('Default Attributes', done => {
      let arrayType = Woowahan.Types.Array();

      arrayType.should.be.an('object');
      arrayType.name.should.equal('array');

      done();
    });

    it('Set Required Attributes', done => {
      let arrayType = Woowahan.Types.Array({ required: true });

      arrayType.required.should.equal(true);

      done();
    });
  });
});