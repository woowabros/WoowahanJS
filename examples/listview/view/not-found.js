import { CoreView } from '../core';

export default CoreView.extend({
  initialize() {
    this.super();
    this.render();
  },

  render() {
    this.$el.html('<strong>Empty Page</strong>');
  }
});