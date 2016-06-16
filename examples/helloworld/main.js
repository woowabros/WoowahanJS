import Woowahan from '../../';

var Index = Woowahan.View.create({
  render() {
    this.$el.html('<h1>Hello, WoowahanJS</h1>');
    return this;
  }  
});

var index = new Index();

$('body').html(index.render().$el);