var p = {
  foo : function () {
    return 'aaa';
  }
};

module.exports = function (parent) {
  return parent.define(p);
};
