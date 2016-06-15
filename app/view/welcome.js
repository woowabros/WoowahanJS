import { CoreView } from '../core';
import Template from './welcome.hbs';

export default CoreView.extend({
  className: 'container',

  initialize() {
    this.super();

    this.render();
  },

  render() {
    this.$el.html(Template());
  }
});