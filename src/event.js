module.exports = {
  create(type, ...args) {
    return {
      wwtype: 'event',
      type: type,
      data: args
    };
  }
};