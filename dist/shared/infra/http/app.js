"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;

require("reflect-metadata");

require("dotenv/config");

var _express = _interopRequireWildcard(require("express"));

require("express-async-errors");

var _cors = _interopRequireDefault(require("cors"));

var _routes = _interopRequireDefault(require("./routes"));

var _AppError = _interopRequireDefault(require("../../errors/AppError"));

var _celebrate = require("celebrate");

require("../typeorm");

var _rateLimiterTest = require("./middlewares/rateLimiterTest");

var _sentryFactory = _interopRequireDefault(require("./factories/sentryFactory"));

require("../../container");

var _api = require("@bull-board/api");

var _express2 = require("@bull-board/express");

var _bullAdapter = require("@bull-board/api/bullAdapter");

var _Queue = _interopRequireDefault(require("../../queues/Queue"));

var _ensureAdmin = _interopRequireDefault(require("./middlewares/ensureAdmin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import ensureAdmin from './middlewares/ensureAdmin'
const app = (0, _express.default)();
exports.app = app;
const serverAdapter = new _express2.ExpressAdapter();
serverAdapter.setBasePath('/admin/queues'); // middlewares

app.use(_rateLimiterTest.rateLimiterMiddleware);
app.use((0, _express.json)());
app.use((req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  req.next();
}); // Sentry

_sentryFactory.default.init(app);

(0, _api.createBullBoard)({
  queues: _Queue.default.queues.map(e => new _bullAdapter.BullAdapter(e.bull)),
  serverAdapter: serverAdapter
}); // routes

app.use('/v1', _routes.default);
app.use((0, _cors.default)());
app.use((0, _celebrate.errors)({
  statusCode: 422
}));

if (process.env.NODE_ENV === 'production') {
  app.use('/admin/queues', _ensureAdmin.default, serverAdapter.getRouter());
} else {
  app.use('/admin/queues', serverAdapter.getRouter());
}

app.use((req, res) => {
  res.status(404).json({
    message: 'Not found'
  });
});

_sentryFactory.default.error(app);

app.use((err, req, res, _) => {
  if (err instanceof _AppError.default) return res.status(err.statusCode).json({
    status: 'error',
    message: err.message
  });
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : `Internal server error - ${err}`
  });
});