import Woowahan from '../../index';
import Template from './main-view.hbs';

const peopleColors = [
  { color: 'white', country: '미국' },
  { color: 'white', country: '영국' },
  { color: 'white', country: '프랑스' },
  { color: 'white', country: '독일' },
  { color: 'yellow', country: '한국' },
  { color: 'yellow', country: '중국' },
  { color: 'yellow', country: '일본' },
  { color: 'black', country: '캐냐' },
  { color: 'black', country: '우간다' },
  { color: 'black', country: '남아프리카공화국' },
  { color: 'white', country: '러시아' }
];

export default Woowahan.View.create('MainView', {
  template: Template,

  events: {
    'click .btn-toggle': 'onToggle',
    'click .btn-check-value': 'onCheckValue',
    'click .btn-update-view': 'onUpdateView',
    'change select[name=skinColor]': 'onChangeSkinColor'
  },
  initialize() {
    this.setModel({
      text1: 'DataRef text1',
      text2: 'DataRef text2'
    });

    this.super();
  },
  viewDidMount() {
    // console.log(this.refs);
  },
  onCheckValue() {
    let text1 = $(this.refs.text1).val(),
    text2 = $(this.refs.text2).val(),
    $alert = $(this.refs.alertMessage),
    isOk = true,
    isVisible = $alert.is(':visible');

    if(text1 === '' || text2 === '') {
      isOk = false;
    }

    $alert
    .text(isOk ? '값 검증에 성공했습니다.' : '값 검증에 실패했습니다')
    .removeClass('alert-success alert-danger')
    .addClass(isOk ? 'alert-success' : 'alert-danger')

    if(!!!isVisible){
      $alert.toggle()
    }
  },
  onChangeSkinColor(event) {
    this.setModel({
      peopleColor: peopleColors.filter(p => p.color == event.target.value).map(p => ({ label: p.country, value: p.color }))
    });

    $(this.refs.peopleColor).css('background-color', event.target.value);
  },

  onToggle() {
    $(this.refs.alertMessage).toggle();
  },

  onUpdateView() {
    this.updateView();
  }
});
