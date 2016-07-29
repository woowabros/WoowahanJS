module.exports = {
  create(type, data = {}) {
    return {
      wwtype: 'action',
      type: type,
      data
    };
  }
};