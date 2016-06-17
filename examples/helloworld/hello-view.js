import Woowahan from '../../';

export default Woowahan.View.create('Index', {
  render() {
    this.$el.html('<h1>Hello, WoowahanJS</h1>');
    return this;
  }
});