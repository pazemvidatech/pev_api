"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ResetPasswordUseCase = _interopRequireDefault(require("../../../useCases/ResetPasswordUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ResetPasswordAccountController {
  async handle(request, response) {
    const {
      email,
      password,
      code
    } = request.body;

    const resetPasswordAccountUseCase = _tsyringe.container.resolve(_ResetPasswordUseCase.default);

    await resetPasswordAccountUseCase.execute({
      email,
      code: String(code),
      password
    });
    return response.status(204).send();
  }

}

var _default = ResetPasswordAccountController;
exports.default = _default;