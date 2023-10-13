"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _SubscriptionWebhookController = _interopRequireDefault(require("../controllers/SubscriptionWebhookController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const subscriptionWebhooksRoutes = (0, _express.Router)();
const subscriptionWebhookController = new _SubscriptionWebhookController.default();
subscriptionWebhooksRoutes.post('/payment', subscriptionWebhookController.handle);
var _default = subscriptionWebhooksRoutes;
exports.default = _default;