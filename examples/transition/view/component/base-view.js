import Woowahan from '../../../../index';
import Template from './base-view.hbs';

export const BaseView = Woowahan.View.create('BaseView', {
  template: Template,

  startTransition() {
    const _this = this;

    let num = 0;

    (function transition() {
      ++num;

      _this.setModel({ num });

      _this.refs.colorBox.style.backgroundColor = `rgba(0, 0, 0, ${num / 100})`;

      if (num < 100) {
        setTimeout(transition, 10);
      } else {
        _this.dispatch(Woowahan.Event.create('transitionComplete'));
      }
    })();
  }
});