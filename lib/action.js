module.exports = {
  create(type, data = {}) {
    return {
      type: type,
      data
    };
  }
};