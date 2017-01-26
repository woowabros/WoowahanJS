import Woowahan from '../../index';
import LayoutView from './view/layout';
import HomeView from './view/home';
import PostsView from './view/posts';
import PostDetailView from './view/posts/post-detail';


import Posts from './reducer/posts';
import Post from './reducer/post';
import Comments from './reducer/comments';

import commentListPlugin from './plugin/commentlist';

global.$ = global.jQuery = Woowahan.$;

require("./sass/board.scss");
require('bootstrap-loader');

const app = new Woowahan();

app.use(Posts);
app.use(Post);
app.use(Comments);

app.use(Woowahan.Layout('#app', LayoutView));
app.use(Woowahan.Plugin('commentlist', commentListPlugin));

app.start({
  url: '/',
  container: '.content',
  layout: 'LayoutView',
  view: HomeView,
  pages: [
  { url: '/posts', view: PostsView },
  { url: '/posts/:id', view: PostDetailView, routeName: 'PostDetailView' },
  //  { url: '/users/:name', view: UserDetailView, routeName: 'UserDetailView' }
  ]
});
