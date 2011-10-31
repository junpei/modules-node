var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  ;

var s = new Schema({
  id : ObjectId
  , foo : String
});

module.exports = function (server) {
  return (server || require('app')).db.model('Foo', s);
};
