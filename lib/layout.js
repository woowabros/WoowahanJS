export default (container, view) => {
  return {
    view: view, 
    container: container, 
    viewName: view.viewname,
    wwtype: 'layout'
  };
};