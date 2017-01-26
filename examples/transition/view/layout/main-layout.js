import Woowahan from '../../../../index';
import Template from './main-layout.hbs';

export const MainLayout = Woowahan.View.create('MainLayout', {
  template: Template,

  events: {
    '@viewDidMount': 'onViewMount',
    '@transitionComplete': 'onCompleteTransition'
  },

  onViewMount(view) {
    this.log(`mount된 view: ${view.viewname}`);

    switch (view.viewname) {
      case 'BaseView':
        view.startTransition();
        break;
    }
  },

  onCompleteTransition() {
    this.log('transition complete');
  }
});
