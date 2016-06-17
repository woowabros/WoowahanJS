import Woowahan from '../../';

global.Woowahan = Woowahan;

const RootView = Woowahan.View.create('Root', {
  initialize(className) {
    this.className = className;
  },

  render() {
    this.$el.html(`<div class="content">루트 내용</div>`);

    return this;
  }
});

const View = Woowahan.View.create('Sub', {
  initialize(className) {
    this.className = className;
  },

  render() {
    this.$el.html(`<div class="${this.className}">내용</div>`);

    return this;
  }
});

// nextView.setElement(currentView.$('key'));

Woowahan.Site.design([
  { url: '', view: RootView, container: '.wrap', pages: [
    { url: 'company', container: '.content', view: View },
    { url: 'overview', container: '.content', view: View, pages: [
      { url: 'overview/:page1', container: '.sub', view: View }
    ] }
  ] }
]);

const woowahan = global.woowahan = new Woowahan;

woowahan.start();

// woowahan.URLMap.create([
//   {
//     view: Layout,
//     url: '/',
//     pages: [
//       {
//         uri: '/ff', view: MainView, pages: [
//         {url: '/sub/:id', view}
//       ]
//       }]
//   },
//   {
//     layout: view,
//     pages: [
//       {  uri: '/', view: MainView, pages: [
//         {url: '/sub/:id', view}
//       ]
//     }
// ]);
//
// woowahan.use(router);
//
// woowahan.start();