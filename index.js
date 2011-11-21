var fs = require('fs')
  path = require('path')
  ;

var Modules = function (server) {
  var t = this;

  t.server = server;
  t.name = null;
  t.path = t.server.set('modules path');

  return t._load();
};

Modules.prototype._load = function () {
  var t = this;

  try {
    var root = t.define(require(t.path));
  }

  catch (e) {
    var root = t.define({});
  }

  var nodes = fs.readdirSync(t.path);
  var nodesLength = nodes.length;

  for (var i = 0; i < nodesLength; ++i) {
    var node = nodes[i];
    var nodePath = path.join(t.path, node);
    var stats = fs.statSync(nodePath);

    if (stats.isDirectory()) {
      try {
        root[node] = t.define(require(nodePath));
      }

      catch (e) {
        root[node] = t.define({});
      }

      root[node].name = node;
      root[node].path = nodePath;
      root[node].controllers = t._loading(path.join(nodePath, 'controllers'));
      root[node].models = t._loading(path.join(nodePath, 'models'));

      if (root[node].hasOwnProperty('router')) {
        root[node].router();
      }
    }
  }

  if (root.hasOwnProperty('router')) {
    root.router();
  }

  return root;
};

Modules.prototype._loading = function (_path) {
  var t = this;
  var objects = {};
  var nodes = null;

  try {
    nodes = fs.readdirSync(_path);
  }

  catch (e) {
    return objects;
  }

  var nodesLength = nodes.length;

  for (var i = 0; i < nodesLength; ++i) {
    var node = nodes[i];
    var nodePath = path.join(_path, node);
    var stats = fs.statSync(nodePath);
    var ext = path.extname(node);
    var name = nodes[i].replace(new RegExp(ext + '$'), '');

    if (stats.isFile() && objects.hasOwnProperty(name)) {
      objects[name] = t.define.call(require(nodePath), objects[name]);
    }

    else if (stats.isFile()) {
      objects[name] = require(nodePath);
    }

    else if (stats.isDirectory()) {
      objects[name] = t._loading(nodePath);
    }
  }
  
  return objects;
};

Modules.prototype._route = function (method, args) {
  var t = this;

  if (t.name) {
    args[0] = '/' + path.join(t.name, args[0]);
  }

  t.server[method].apply(t.server, args);
};

Modules.prototype.define = function (properties) {
  var t = this;
  var p = properties || {};
  var object = Object.create(t);
  var keys = Object.keys(p);
  var keysLength = keys.length;

  for (var i = 0; i < keysLength; ++i) {
    var key = keys[i];
    var descriptor = Object.getOwnPropertyDescriptor(p, key);

    Object.defineProperty(object, key, descriptor);
  }

  return object;
};

Modules.prototype.get = function () {
  this._route('get', Array.apply(null, arguments));
};

Modules.prototype.post = function () {
  this._route('post', Array.apply(null, arguments));
};

Modules.prototype.put = function () {
  this._route('put', Array.apply(null, arguments));
};

Modules.prototype.del = function () {
  this._route('del', Array.apply(null, arguments));
};

Modules.prototype.error = function () {
  var t = this;

  t.server.error.apply(t.server, Array.apply(null, arguments))
};

module.exports = function (app) {
  var server = app || require('app');
  return new Modules(server);
};
