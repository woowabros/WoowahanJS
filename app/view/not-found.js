import { CoreView } from '../core';

export default CoreView.extend({
  initialize() {
    CoreView.prototype.initialize.apply(this, arguments);

    this.render();
  },

  render() {
    this.$el.html('<strong>Empty Page</strong>');
  }
});