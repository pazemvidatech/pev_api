"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ForgotPasswordUseCase = _interopRequireDefault(require("../../../useCases/ForgotPasswordUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ForgotPasswordAccountController {
  async handle(request, response) {
    const {
      email
    } = request.body;

    const resetPasswordAccountUseCase = _tsyringe.container.resolve(_ForgotPasswordUseCase.default);

    await resetPasswordAccountUseCase.execute({
      email
    });
    return response.status(204).send();
  }

}

var _default = ForgotPasswordAccountController;
exports.default = _default;