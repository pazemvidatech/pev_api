"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

require("dotenv/config");

var _db = _interopRequireDefault(require("../../../config/db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AppDataSource = new _typeorm.DataSource(_db.default);
AppDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
}).catch(err => {
  console.error('Error during Data Source initialization', err);
});
var _default = AppDataSource;
exports.default = _default;