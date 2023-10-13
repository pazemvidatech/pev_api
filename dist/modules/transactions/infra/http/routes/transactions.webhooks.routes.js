"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _TransactionWebhookController = _interopRequireDefault(require("../controllers/TransactionWebhookController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transactionWebhooksRoutes = (0, _express.Router)();
const transactionWebhookController = new _TransactionWebhookController.default();
transactionWebhooksRoutes.post('/payment', transactionWebhookController.handle);
var _default = transactionWebhooksRoutes;
exports.default = _default;