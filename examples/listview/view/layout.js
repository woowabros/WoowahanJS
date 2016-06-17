import { CoreView } from '../core';
import Template from './layout.hbs';

export default CoreView.extend({
  className: 'container',
  el: '.subview',

  initialize() {
    this.super();
    this.render();
  },

  render() {
    this.$el.html(Template());
  }
});