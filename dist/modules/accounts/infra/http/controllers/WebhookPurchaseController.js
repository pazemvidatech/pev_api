"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UpdateAccountCreditsUseCase = _interopRequireDefault(require("../../../useCases/UpdateAccountCreditsUseCase"));

var _SubscriptionWebhookUseCase = _interopRequireDefault(require("../../../../subscriptions/useCases/SubscriptionWebhookUseCase"));

var _tsyringe = require("tsyringe");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebhookPurchaseController {
  async handle(req, res) {
    const {
      id,
      app_user_id,
      product_id,
      type,
      store
    } = req.body.event;

    const updateAccountCreditsUseCase = _tsyringe.container.resolve(_UpdateAccountCreditsUseCase.default);

    const subscriptionWebhookUseCase = _tsyringe.container.resolve(_SubscriptionWebhookUseCase.default);

    if (product_id.includes('pev_premium')) {
      await subscriptionWebhookUseCase.execute({
        accountId: app_user_id,
        productId: product_id,
        externalId: id,
        status: type,
        platform: store
      });
    } else {
      await updateAccountCreditsUseCase.execute({
        accountId: app_user_id,
        productId: product_id,
        externalId: id,
        status: type,
        platform: store
      });
    }

    return res.json();
  }

}

exports.default = WebhookPurchaseController;