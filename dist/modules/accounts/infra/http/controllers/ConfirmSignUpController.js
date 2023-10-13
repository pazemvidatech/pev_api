"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ConfirmSignUpUseCase = _interopRequireDefault(require("../../../useCases/ConfirmSignUpUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConfirmSignUpController {
  async handle(req, res) {
    const {
      email,
      code
    } = req.body;

    const confirmSignUpUseCase = _tsyringe.container.resolve(_ConfirmSignUpUseCase.default);

    await confirmSignUpUseCase.execute({
      email,
      code
    });
    return res.json();
  }

}

exports.default = ConfirmSignUpController;