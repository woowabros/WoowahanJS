import Woowahan from '../../';

export default Woowahan.View.create('Index', {
  render() {
    this.$el.html('<h1>Hello, Schema</h1>');
    return this;
  }
});