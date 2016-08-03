module.exports = (name, view) => {
  return {
    view: view,
    name: name,
    viewName: view.viewname,
    wwtype: 'component'
  };
};