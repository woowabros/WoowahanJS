import Woowahan from '../../../../index';
import Template from '../templates/todo-state.hbs';

export default Woowahan.View.create('TodoState', {
  template: Template,
  events: {
    'click .clear-completed': 'clearCompleted',
  },
  initialize(model) {
    this.setModel(model);
    this.super();
  },

  viewWillMount(renderData) {
    renderData.items = renderData.remaining > 1;
    renderData.all = !renderData.filter;
    renderData.active = renderData.filter === 'active';
    renderData.completed = renderData.filter === 'completed';

    return renderData;
  }
});