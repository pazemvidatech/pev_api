"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateSubscriptionUseCase = _interopRequireDefault(require("../../../useCases/CreateSubscriptionUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateSubscriptionController {
  async handle(req, res) {
    const {
      name,
      expireAt,
      accountId
    } = req.body;

    const createSubscription = _tsyringe.container.resolve(_CreateSubscriptionUseCase.default);

    const subscription = await createSubscription.execute({
      name,
      accountId,
      expireAt
    });
    return res.json(subscription);
  }

}

var _default = CreateSubscriptionController;
exports.default = _default;