"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rateLimiterMiddleware = void 0;

var _rateLimiterFlexible = require("rate-limiter-flexible");

var _cache = _interopRequireDefault(require("../../../../config/cache"));

var _ioredis = _interopRequireDefault(require("ioredis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const redisClient = new _ioredis.default(_cache.default[process.env.NODE_ENV]);
redisClient.on('error', err => {
  console.log(err);
  redisClient.disconnect();
  redisClient.connect();
});
const MAX_REQUEST_LIMIT = 100;
const MAX_REQUEST_WINDOW = 60;
const TOO_MANY_REQUESTS_MESSAGE = 'Too many requests';
const options = {
  duration: MAX_REQUEST_WINDOW,
  points: MAX_REQUEST_LIMIT,
  storeClient: redisClient
};
const rateLimiter = new _rateLimiterFlexible.RateLimiterRedis(options);

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip).then(rateLimiterRes => {
    res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
    res.setHeader('X-RateLimit-Limit', MAX_REQUEST_LIMIT);
    res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
    next();
  }).catch(() => {
    res.status(429).json({
      message: TOO_MANY_REQUESTS_MESSAGE
    });
  });
};

exports.rateLimiterMiddleware = rateLimiterMiddleware;