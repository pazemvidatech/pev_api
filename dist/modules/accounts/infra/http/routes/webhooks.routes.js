"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _WebhookPurchaseController = _interopRequireDefault(require("../controllers/WebhookPurchaseController"));

var _ensureRevenueCat = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureRevenueCat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webhookPurchaseController = new _WebhookPurchaseController.default();
const webhooksRoutes = (0, _express.Router)();
webhooksRoutes.use(_ensureRevenueCat.default);
webhooksRoutes.post('/purchase', webhookPurchaseController.handle);
var _default = webhooksRoutes;
exports.default = _default;