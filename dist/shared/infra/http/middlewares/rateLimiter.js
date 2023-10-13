"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rateLimiter;

var _rateLimiterFlexible = require("rate-limiter-flexible");

var _ioredis = _interopRequireDefault(require("ioredis"));

var _cache = _interopRequireDefault(require("../../../../config/cache"));

var _AppError = _interopRequireDefault(require("../../../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function rateLimiter(request, response, next) {
  if (process.env.NODE_ENV === 'production') {
    const redisClient = new _ioredis.default(_cache.default.production);
    const limiter = new _rateLimiterFlexible.RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'rateLimiter',
      points: 5,
      duration: 2
    });

    try {
      await limiter.consume(request.ip);
      return next();
    } catch (err) {
      throw new _AppError.default(err, 429);
    }
  }

  return next();
}