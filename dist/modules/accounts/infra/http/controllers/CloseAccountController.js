"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CloseAccountUseCase = _interopRequireDefault(require("../../../useCases/CloseAccountUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CloseAccountController {
  async handle(request, response) {
    const accountId = request.account.id;

    const closeAccountUseCase = _tsyringe.container.resolve(_CloseAccountUseCase.default);

    await closeAccountUseCase.execute(accountId);
    return response.status(204).send();
  }

}

var _default = CloseAccountController;
exports.default = _default;