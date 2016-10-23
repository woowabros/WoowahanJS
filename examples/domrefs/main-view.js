import Woowahan from '../../index';
import Template from './main-view.hbs';

export default Woowahan.View.create('MainView', {
  template: Template,

  events: {
    'click .btn-toggle': 'onToggle',
    'click .btn-check-value': 'onCheckValue',
    'click .btn-update-view': 'onUpdateView'
  },

  viewDidMount() {
    console.log(this.refs);
  },

  onToggle() {
    $(this.refs.alertMessage).toggle();
  },

  onUpdateView() {
    this.updateView();
  }
});
