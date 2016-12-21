import Woowahan from '../../../index';
import Template from './main1.hbs';

const DEFAULT_IMAGE = '이것도 에러 이미지!';

export default Woowahan.View.create('MainView1', {
  template: Template,

  initialize() {
    this.setModel({ src: 'efeeefe' });

    this.super();
  },

  viewDidMount() {
    this.$('img').error(function() {
      console.log('test');
      
      $(this).off('error').prop('src', DEFAULT_IMAGE);

    }).prop('src', this.getModel('src'));
  }
});