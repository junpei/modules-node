var e = module.exports = {};

e.begin = function (req, res, next) {
  console.log('aaa.begin()');
  next();
};

e.router = function () {
  var t = this;

  t.get('/foo', t.begin, t.controllers.foo.index);
};
