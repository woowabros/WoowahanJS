import Woowahan from '../../../../index';
import Template from './base-view.hbs';

export const BaseView = Woowahan.View.create('BaseView', {
  template: Template,

  startTransition() {

    let num = 0;
    var transition = function(){
      ++num;

      this.setModel({ num });

      this.refs.colorBox.style.backgroundColor = `rgba(0, 0, 0, ${num / 100})`;

      if (num < 100) {
        setTimeout(transition, 10);
      } else {
        this.dispatch(Woowahan.Event.create('transitionComplete'));
      }
    }.bind(this);

    transition();

  }
});
