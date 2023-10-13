"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _celebrate = require("celebrate");

var _CreateSubscriptionController = _interopRequireDefault(require("../controllers/CreateSubscriptionController"));

var _DeleteSubscriptionController = _interopRequireDefault(require("../controllers/DeleteSubscriptionController"));

var _FindAllSubscriptionsController = _interopRequireDefault(require("../controllers/FindAllSubscriptionsController"));

var _ensureAdmin = _interopRequireDefault(require("../../../../../shared/infra/http/middlewares/ensureAdmin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const subscriptionRoutes = (0, _express.Router)();
const createSubscriptionController = new _CreateSubscriptionController.default();
const deleteSubscriptionController = new _DeleteSubscriptionController.default();
const findAllSubscriptionsController = new _FindAllSubscriptionsController.default();
subscriptionRoutes.use(_ensureAdmin.default);
subscriptionRoutes.get('/', findAllSubscriptionsController.handle);
subscriptionRoutes.post('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    accountId: _celebrate.Joi.string().uuid().required(),
    name: _celebrate.Joi.string().required(),
    expireAt: _celebrate.Joi.date().required()
  }
}), createSubscriptionController.handle);
subscriptionRoutes.delete('/:subscription_id', (0, _celebrate.celebrate)({
  [_celebrate.Segments.PARAMS]: {
    subscription_id: _celebrate.Joi.string().uuid().required()
  }
}), deleteSubscriptionController.handle);
var _default = subscriptionRoutes;
exports.default = _default;