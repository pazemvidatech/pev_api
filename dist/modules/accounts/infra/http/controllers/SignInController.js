"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _SignInUseCase = _interopRequireDefault(require("../../../useCases/SignInUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SignInController {
  async handle(req, res) {
    const {
      email,
      password,
      fmToken
    } = req.body;

    const signInUseCase = _tsyringe.container.resolve(_SignInUseCase.default);

    const data = await signInUseCase.execute({
      email,
      password,
      fmToken
    });
    return res.json(data);
  }

}

exports.default = SignInController;