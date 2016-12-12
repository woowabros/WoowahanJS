module.exports = (container, view, options) => {
  return {
    view,
    container,
    options: Object.assign({ update: true }, options),
    viewName: view.viewname,
    wwtype: 'layout'
  };
};