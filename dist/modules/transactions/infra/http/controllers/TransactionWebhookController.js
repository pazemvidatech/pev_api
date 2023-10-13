"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _TransactionWebhookUseCase = _interopRequireDefault(require("../../../useCases/TransactionWebhookUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransactionWebhookController {
  async handle(req, res) {
    const paymentData = req.body.data;

    const transactionWebhook = _tsyringe.container.resolve(_TransactionWebhookUseCase.default);

    await transactionWebhook.execute(paymentData.id);
    return res.json();
  }

}

var _default = TransactionWebhookController;
exports.default = _default;