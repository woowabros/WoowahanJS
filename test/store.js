import { assert } from 'chai';
import Woowahan from '../';

describe('Store', () => {
  it('Create Store', () => {
    let app = new Woowahan();

    app.use(Woowahan.Store.create({ foo: {} }));

    assert.typeOf(app.getStates().foo, 'object');
  });
});
