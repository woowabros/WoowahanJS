import Woowahan from '../../../../index';
import PostDetail from './post-detail.hbs';
import PostDetailCommentsView from './post-detail-comments';
import PostDetailContnetView from './post-detail-content';

import { FETCH_POST,FETCH_COMMENTS } from '../../action';

const testUpdateView = Woowahan.View.create('testView' , {
  template: '<div>CLEAR!!!</div>'
});

export default Woowahan.View.create('PostDetail', {
  template: PostDetail,

  events: {
    'click #btn-back': 'onClickBack'
  },
  initialize() {
    this.super();
  },
  viewWillMount(renderData) {
    this.dispatch(Woowahan.Action.create(FETCH_POST, { id: this.params.id }), function(data, err) {
      this.fetchOnePost(data);
    });

    this.dispatch(Woowahan.Action.create(FETCH_COMMENTS, { id: this.params.id }), function(data, err) {
      this.fetchComments(data);
    });
    renderData.id = this.params.id;
    return renderData;
  },
  viewDidMount() {
    var _this = this;
    setTimeout(function() {
      _this.updateView( _this.refs.postContent , testUpdateView);
      _this.updateView( _this.refs.postComments , testUpdateView);
    }, 3000)
  },
  fetchOnePost(data) {
    this.updateView( this.refs.postContent , PostDetailContnetView, data);
    this.setModel({
      title: data.title
    })
  },
  fetchComments(data) {
    this.updateView( this.refs.postComments , PostDetailCommentsView, data);
  },
  onClickBack() {
    window.history.back();
  }
});
