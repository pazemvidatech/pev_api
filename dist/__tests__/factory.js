"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("reflect-metadata");

require("dotenv/config");

require("express-async-errors");

var _routes = _interopRequireDefault(require("../shared/infra/http/routes"));

var _celebrate = require("celebrate");

var _typeorm = _interopRequireDefault(require("../shared/infra/typeorm"));

var _http = require("http");

var _express = _interopRequireWildcard(require("express"));

var _supertest = _interopRequireDefault(require("supertest"));

var _AppError = _interopRequireDefault(require("../shared/errors/AppError"));

require("../shared/container");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TestFactory {
  constructor() {
    this._app = void 0;
    this._connection = void 0;
    this._server = void 0;
  }

  get app() {
    return (0, _supertest.default)(this._server);
  }

  get connection() {
    return this._connection;
  }

  get server() {
    return this._server;
  } // Connect to db and start server


  async init() {
    this._connection = await _typeorm.default.initialize();
    await this._connection.runMigrations();
    const app = (0, _express.default)();
    app.use((0, _express.json)());
    app.use('/v1', _routes.default);
    app.use((0, _celebrate.errors)());
    app.use((err, req, res, _) => {
      if (err instanceof _AppError.default) return res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
      return res.status(500).json({
        status: 'error',
        message: `Internal server error - ${err.message}`
      });
    });
    this._app = app;
    this._server = (0, _http.createServer)(this._app).listen(process.env.NODE_PORT);
  }

  async close() {
    this._server.close();

    await this._connection.dropDatabase();
    await this._connection.close();
  }

}

exports.default = TestFactory;