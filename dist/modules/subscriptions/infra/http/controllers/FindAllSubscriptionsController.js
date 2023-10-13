"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _FindAllSubscriptionsUseCase = _interopRequireDefault(require("../../../useCases/FindAllSubscriptionsUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FindAllSubscriptionsController {
  async handle(req, res) {
    const findAllSubscriptions = _tsyringe.container.resolve(_FindAllSubscriptionsUseCase.default);

    const subscription = await findAllSubscriptions.execute();
    return res.json(subscription);
  }

}

var _default = FindAllSubscriptionsController;
exports.default = _default;