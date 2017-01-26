import Woowahan from '../../../../index';
import Template from './index.hbs';

import HomeContentsView from './home';

export default Woowahan.View.create('HomeView', {
  template: Template,
  initialize() {
    this.super();
  }
});
