"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _RefreshTokenUseCase = _interopRequireDefault(require("../../../useCases/RefreshTokenUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RefreshTokenController {
  async handle(req, res) {
    const {
      refreshToken,
      fmToken
    } = req.body;

    const refreshTokenUseCase = _tsyringe.container.resolve(_RefreshTokenUseCase.default);

    const data = await refreshTokenUseCase.execute({
      refreshToken,
      fmToken
    });
    return res.json(data);
  }

}

var _default = RefreshTokenController;
exports.default = _default;