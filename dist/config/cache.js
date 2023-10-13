"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _redisUrl = _interopRequireDefault(require("redis-url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  development: {
    host: parseRedisURL(process.env.REDIS_TLS_URL).host,
    port: Number(parseRedisURL(process.env.REDIS_TLS_URL).port),
    password: parseRedisURL(process.env.REDIS_TLS_URL).password,
    tls: {
      rejectUnauthorized: false
    }
  },
  test: {
    host: parseRedisURL(process.env.REDIS_TLS_URL).host,
    port: Number(parseRedisURL(process.env.REDIS_TLS_URL).port),
    password: parseRedisURL(process.env.REDIS_TLS_URL).password
  },
  local: {
    host: parseRedisURL(process.env.REDIS_TLS_URL).host,
    port: Number(parseRedisURL(process.env.REDIS_TLS_URL).port),
    password: parseRedisURL(process.env.REDIS_TLS_URL).password
  },
  production: {
    host: parseRedisURL(process.env.REDIS_TLS_URL).host,
    port: Number(parseRedisURL(process.env.REDIS_TLS_URL).port),
    password: parseRedisURL(process.env.REDIS_TLS_URL).password,
    tls: {
      rejectUnauthorized: false
    }
  }
};
exports.default = _default;

function parseRedisURL(redisURL) {
  const redisConfig = _redisUrl.default.parse(redisURL);

  const host = redisConfig.hostname || '';
  const port = redisConfig.port || 6379;
  const password = redisConfig.password ? decodeURIComponent(redisConfig.password) : undefined;
  return {
    host,
    port,
    password
  };
}