export default {
  create(type, data = {}) {
    return {
      type: type,
      data
    };
  }
};