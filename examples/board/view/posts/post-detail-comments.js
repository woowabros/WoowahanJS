import Woowahan from '../../../../index';
import PostDetailCommentsView from './post-detail-comments.hbs';

export default Woowahan.View.create('PostComments', {
  template: PostDetailCommentsView,

  events: {

  },
  initialize(model) {
    this.setModel({
      comments: model
    });

    this.super();
  },
  viewWillMount(renderData) {
    return renderData;
  }
});
