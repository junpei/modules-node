var p = {
  foo : function () {
    return 'root';
  }
};

module.exports = function (parent) {
  return parent.define(p);
};
