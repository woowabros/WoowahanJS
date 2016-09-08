module.exports = {
  create(type, plugin) {
    return {
      wwtype: 'plugin',
      type: type,
      plugin: plugin
    };
  }
};