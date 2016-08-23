/*global $*/

const MD5 = require('md5');

const defaultConfiguration = {
  timeout: 5000
};

let Reducer;
let app;

Reducer = {
  queueSuccess: [],
  queueFail: [],
  extend(protoProps) {
    const child = _.extend({}, _.cloneDeep(this));

    if (!!protoProps.onSuccess) {
      child.queueSuccess.push(protoProps.onSuccess);
    }

    if (!!protoProps.onFail) {
      child.queueFail.push(protoProps.onFail);
    }

    return child;
  },
  create(actionName, schema, handler, successHandlers, failHandlers) {
    if (typeof schema === 'function') {
      handler = schema;
      schema = void 0;
    } else {
      if (typeof schema === 'object' && schema.wwtype !== 'schema') {
        throw new Error('The second argument of reducer will only function, or schema objects.');
      }
    }

    const _this = this;

    let Reducer = function(data, subscriber) {
      this._timestamp = Date.now();
      this._id = MD5(actionName.toLowerCase()+this._timestamp);
      this.subscriber = subscriber;
      this.useraction(data);
      this.addAction(this._id);

      this.queueSuccess = _.cloneDeep(successHandlers);
      this.queueFail = _.cloneDeep(failHandlers);
    };

    Reducer.wwtype = 'reducer';
    Reducer.actionName = actionName;
    Reducer.schema = schema;

    let fn = _.extend(Reducer.prototype, {
      onSuccess: _this.onSuccess,
      onFail: _this.onFail
    });
    
    fn.useraction = handler;

    fn.id = () => this._id;
    fn.actionName = actionName;
    fn.createtime = () => this._timestamp;
    fn.addAction = (id) => app.addAction(id);
    fn.addError = (err) => app.addError(err);
    fn.removeAction = (id) => app.removeAction(id);
    fn.getStates = () => app.getStates();
    
    fn.loadScript = function(path, id) {
      if (!id) {
        id = MD5(path.toLowerCase());
      }

      let script = $('script[id=' + id + ']');

      if (!!script.length) {
        (this.onSuccess || this.success).call(this);
        return;
      }

      script = document.createElement('script');
      
      document.getElementsByTagName('head')[0].appendChild(script);
      
      script.addEventListener('load', (this.onSuccess || this.success).bind(this));
      script.addEventListener('error', (this.onFail || this.fail).bind(this));

      script.id = id;
      script.type = 'text/javascript';
      script.src = path;
    };

    fn.requestData = function(url, settings, method = 'GET') {
      if (typeof url === 'object') {
        settings = Object.assign(defaultConfiguration, url);
      } else {
        settings = Object.assign(defaultConfiguration, settings);
        settings.url = url;
      }

      settings.type = method.toUpperCase();

      let success = function(...args) {
        const queueSuccess = _.concat(_this.queueSuccess, this.queueSuccess);

        if (!!queueSuccess.length || !!this.onSuccess) {
          for (const item of queueSuccess) {
            item.apply(this, args);
          }

          !!this.onSuccess && this.onSuccess.apply(this, args);
        } else {
          this.success.apply(this, args);
        }
      };

      let fail = function(...args) {
        const queueFail = _.concat(_this.queueFail, this.queueFail);

        if (!!queueFail.length || !!this.onFail) {
          for (const item of queueFail) {
            item.apply(this, args);
          }

          !!this.onFail && this.onFail.apply(this, args);
        } else {
          this.fail.apply(this, args);
        }
      };

      return $.ajax(settings)
        .done(success.bind(this))
        .fail(fail.bind(this));
    };

    fn.getData = function(url, settings) {
      return this.requestData(url, settings, 'get');
    };

    fn.putData = function(url, settings) {
      return this.requestData(url, settings, 'put');
    };

    fn.postData = function(url, settings) {
      return this.requestData(url, settings, 'post');
    };

    fn.deleteData = function(url, settings) {
      return this.requestData(url, settings, 'delete');
    };

    fn.success = function(data) {

    };

    fn.fail = function(request, error) {
      if ('abort' in request) {
        request.abort();
      }

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

module.exports = function(toolset) {
  if (!app) {
    app = toolset;
  }
  
  return Reducer;
};