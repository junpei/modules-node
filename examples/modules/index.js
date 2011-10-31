var e = module.exports = {};

e.auth = function (req, res, next) {
  console.log('root.auth()');
  next();
};
