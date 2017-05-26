var app = new Woowahan();

window.$ = window.jQuery = Woowahan.$;

var HelloView = Woowahan.View.create('HelloView', {
  template: Handlebars.compile(
    '<div><button class="btn toggle" data-role="bind" data-name="buttonLabel">{{buttonLabel}}</button></div>'+
    '<div class="container"><time data-role="bind" data-name="time">{{time}}</time></div>'
  ),

  events: {
    'click .btn.toggle': 'onTimerToggle'
  },

  initialize() {
    this.startTime = 0;
    this.updateHandle = null;

    this.setModel({
      time: this.startTime,
      buttonLabel: 'START'
    });

    this.super();
  },

  viewWillUnmount() {
    this.updateHandle && clearInterval(this.updateHandle);
  },

  onTimerToggle() {
    if (this.updateHandle) this.stopTimer();
    else this.startTimer();
  },

  stopTimer() {
    clearInterval(this.updateHandle);

    this.updateHandle = null;
    this.setModel({ buttonLabel: 'START' });
  },

  startTimer() {
    this.setModel({ buttonLabel: 'STOP' });
    this.startTime = Date.now();

    this.updateHandle = setInterval(() => {
      this.setModel({ time: (Date.now() - this.startTime) / 1000 });
    }, 1000/30);
  }
});

app.start({
  url: '/',
  container: '#app',
  view: HelloView
});