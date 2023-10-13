"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _SubscriptionWebhookUseCase = _interopRequireDefault(require("../../../useCases/SubscriptionWebhookUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SubscriptionWebhookController {
  async handle(req, res) {
    const paymentData = req.body.data;

    const subscriptionWebhook = _tsyringe.container.resolve(_SubscriptionWebhookUseCase.default);

    await subscriptionWebhook.execute(paymentData.id);
    return res.json();
  }

}

var _default = SubscriptionWebhookController;
exports.default = _default;