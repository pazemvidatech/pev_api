"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _DeleteSubscriptionUseCase = _interopRequireDefault(require("../../../useCases/DeleteSubscriptionUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DeleteSubscriptionController {
  async handle(req, res) {
    const {
      subscription_id
    } = req.params;

    const deleteSubscription = _tsyringe.container.resolve(_DeleteSubscriptionUseCase.default);

    await deleteSubscription.execute(subscription_id);
    return res.status(204).send();
  }

}

var _default = DeleteSubscriptionController;
exports.default = _default;