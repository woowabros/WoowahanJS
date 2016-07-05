import Woowahan from '../../../';
import Template from '../template/todo-state.hbs';

export default Woowahan.View.create('TodoState', {
  template: Template,

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
  },

  onUpdate(model) {
    this.setModel(model);
    this.updateView();
  }
});