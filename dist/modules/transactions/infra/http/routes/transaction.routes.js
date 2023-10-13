"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _celebrate = require("celebrate");

var _CreateTransactionController = _interopRequireDefault(require("../controllers/CreateTransactionController"));

var _DeleteTransactionController = _interopRequireDefault(require("../controllers/DeleteTransactionController"));

var _FindAllTransactionsController = _interopRequireDefault(require("../controllers/FindAllTransactionsController"));

var _ensureAdmin = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAdmin"));

var _ensureAuthenticated = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAuthenticated"));

var _SortQueryType = require("../../../types/SortQueryType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transactionRoutes = (0, _express.Router)();
const createTransactionController = new _CreateTransactionController.default();
const deleteTransactionController = new _DeleteTransactionController.default();
const findAllTransactionsController = new _FindAllTransactionsController.default();
transactionRoutes.use(_ensureAuthenticated.default);
transactionRoutes.get('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.QUERY]: _celebrate.Joi.object({
    sort: _celebrate.Joi.string().valid(..._SortQueryType.arraySorts).optional().default('createdAt:DESC'),
    page: _celebrate.Joi.number().optional().default(1),
    size: _celebrate.Joi.number().optional().default(10)
  }).unknown(false)
}), findAllTransactionsController.handle);
transactionRoutes.use(_ensureAdmin.default);
transactionRoutes.post('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    accountId: _celebrate.Joi.string().uuid().required(),
    description: _celebrate.Joi.string().required(),
    externalId: _celebrate.Joi.string().optional(),
    amount: _celebrate.Joi.number().required(),
    type: _celebrate.Joi.string().valid(...['credit', 'debit']).required()
  }
}), createTransactionController.handle);
transactionRoutes.delete('/:transactionId', (0, _celebrate.celebrate)({
  [_celebrate.Segments.PARAMS]: {
    transactionId: _celebrate.Joi.string().uuid().required()
  }
}), deleteTransactionController.handle);
var _default = transactionRoutes;
exports.default = _default;