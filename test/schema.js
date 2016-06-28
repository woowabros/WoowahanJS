import chai from 'chai';
import Woowahan from '../';

chai.should();

describe('Schema & Validation', () => {
  describe('String Type', () => {
    it('Default Attributes', done => {
      let schema = Woowahan.Schema.create('mySchema', {
        name: Woowahan.Types.String()
      });

      schema.wwtype.should.equal('schema');

      done();
    });
  });
});