import Woowahan from '../../';
import TmpMain from './template/main.hbs';
import TmpSub1 from './template/sub1.hbs';
import TmpSub2 from './template/sub2.hbs';
import TmpSub2_2 from './template/sub2-2.hbs';


global.Woowahan = Woowahan;

const MainView = Woowahan.View.create('Main', {
  render() {
    this.$el.html(TmpMain());

    return this;
  }
});

const Sub1View = Woowahan.View.create('Sub1', {
  render() {
    this.$el.html(TmpSub1());

    return this;
  }
});

const Sub2View = Woowahan.View.create('Main', {
  render() {
    this.$el.html(TmpSub2());

    return this;
  }
});

const Sub2_2View = Woowahan.View.create('Main', {
  render() {
    this.$el.html(TmpSub2_2());

    return this;
  }
});

// nextView.setElement(currentView.$('key'));

const siteDesign = {
  design: { url: '', view: MainView, container: '.wrap', pages: [
    { url: 'sub1', container: '.wrap', view: Sub1View },
    { url: 'sub2', container: '.wrap', view: Sub2View, pages: [
      { url: 'sub2_2', container: '.content', view: Sub2_2View }
    ] }
  ] },
  options: { empty: page => { alert(`${page}는 없는 페이지!!`); } }
};

const woowahan = new Woowahan;

woowahan.start(siteDesign);