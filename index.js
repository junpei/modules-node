var fs = require('fs')
  path = require('path')
  ;

var Modules = function (parent) {
  var t = this;

  t.parent = parent;
  t.path = parent.set('modules path');

  return t._load();
};

Modules.prototype._load = function () {
  var t = this;
  var root = require(t.path)(t);
  var nodes = fs.readdirSync(t.path);
  var nodesLength = nodes.length;

  for (var i = 0; i < nodesLength; ++i) {
    var node = nodes[i];
    var nodePath = path.join(t.path, node);
    var stats = fs.statSync(nodePath);

    if (stats.isDirectory()) {
      try {
        root[node] = require(nodePath)(root);
      }

      catch (e) {
        root[node] = t.define();
      }
    }
  }

  return root;
};

Modules.prototype.define = function (properties) {
  var t = this;
  var p = properties || {};
  var object = Object.create(t);
  var names = Object.getOwnPropertyNames(p);
  var namesLength = names.length;

  for (var i = 0; i < namesLength; ++i) {
    var name = names[i];
    var descriptor = Object.getOwnPropertyDescriptor(p, name);

    Object.defineProperty(object, name, descriptor);
  }

  return object;
};

module.exports = function (parent) {
  return new Modules(parent);
};
