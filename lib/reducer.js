/*global $*/

var MD5 = require('md5');

const defaultConfiguration = {
  timeout: 5000
};

module.exports = {
  create(actionName, handler) {
    let Reducer = function(data, subscriber) {
      this._timestamp = Date.now();
      this._id = MD5(actionName.toLowerCase()+this._timestamp);
      this.subscriber = subscriber;
      this.useraction(data);
      this.addAction(this._id);
    };

    Reducer.wwtype = 'reducer';
    Reducer.actionName = actionName;

    let fn = Reducer.prototype;

    fn.useraction = handler;

    fn.id = () => this._id;
    fn.createtime = () => this._timestamp;
    fn.addAction = (id) => global.woowahan.addAction(id);
    fn.addError = (err) => global.woowahan.addError(err);
    fn.removeAction = (id) => global.woowahan.removeAction(id);

    fn.getData = function(url, settings) {
      if (typeof url === 'object') {
        settings = Object.assign(defaultConfiguration, url);
      } else {
        settings = Object.assign(defaultConfiguration, settings);
        settings.url = url;
      }

      let success = this.onSuccess || this.success;
      let fail = this.onFail || this.fail;

      $.get(settings)
        .done(success.bind(this))
        .fail(fail.bind(this));
    };

    fn.putData = function(url, settings) {

    };

    fn.postData = function(url, settings) {

    };

    fn.deleteData = function(url, settings) {

    };

    fn.success = function(data) {

    };

    fn.fail = function(request, error) {
      request.abort();

      //TODO: 오류 발생시 바로 삭제하지 않고 작업을 Disable 시킨 후 오류 처리시 Retry 등의 로직을 수행할 수 있도록 선택지를 만듬
      this.removeAction(this._id);
      this.addError(error);
    };

    fn.finish = function(data, options) {
      options = options || null;

      this.subscriber && this.subscriber.call(this, data, options);
      this.removeAction(this._id);
    };

    return Reducer;
  }
};