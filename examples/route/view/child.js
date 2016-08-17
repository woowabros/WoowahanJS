import Woowahan from '../../../index';
import SubChildView from './sub-child';

export default Woowahan.View.create('ChildView', {
  template: `<p>Child View</p><div id="sub-child-container"></div>`,

  viewDidMount() {
    this.addView('#sub-child-container', SubChildView);
  }
});