"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _SignUpUseCase = _interopRequireDefault(require("../../../useCases/SignUpUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SignUpController {
  async handle(req, res) {
    const {
      name,
      email,
      password
    } = req.body;

    const signUpUseCase = _tsyringe.container.resolve(_SignUpUseCase.default);

    await signUpUseCase.execute({
      name,
      email,
      password
    });
    return res.json();
  }

}

exports.default = SignUpController;