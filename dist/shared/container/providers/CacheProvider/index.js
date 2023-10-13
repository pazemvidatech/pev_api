"use strict";

var _tsyringe = require("tsyringe");

var _RedisCacheProvider = _interopRequireDefault(require("./implementations/RedisCacheProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const providers = {
  development: _RedisCacheProvider.default,
  test: _RedisCacheProvider.default,
  local: _RedisCacheProvider.default,
  production: _RedisCacheProvider.default
};

_tsyringe.container.registerSingleton('CacheProvider', providers[process.env.NODE_ENV]);