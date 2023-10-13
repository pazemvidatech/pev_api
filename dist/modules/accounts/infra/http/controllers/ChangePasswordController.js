"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ChangePasswordUseCase = _interopRequireDefault(require("../../../useCases/ChangePasswordUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChangePasswordController {
  async handle(request, response) {
    const {
      oldPassword,
      newPassword
    } = request.body;
    const {
      accessToken
    } = request;

    const resetPasswordUseCase = _tsyringe.container.resolve(_ChangePasswordUseCase.default);

    await resetPasswordUseCase.execute({
      accessToken,
      oldPassword,
      newPassword
    });
    return response.status(204).send();
  }

}

var _default = ChangePasswordController;
exports.default = _default;