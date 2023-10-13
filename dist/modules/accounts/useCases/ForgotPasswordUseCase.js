"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IAuthenticationProvider = _interopRequireDefault(require("../../../shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ForgotPasswordUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('AuthenticationProvider')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _IAuthenticationProvider.default === "undefined" ? Object : _IAuthenticationProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class ForgotPasswordUseCase {
  constructor(authProvider) {
    this.authProvider = authProvider;
  }

  async execute({
    email
  }) {
    try {
      await this.authProvider.forgotPassword(email);
    } catch (error) {
      throw new _AppError.default(error.message, error.statusCode);
    }
  }

}) || _class) || _class) || _class) || _class);
var _default = ForgotPasswordUseCase;
exports.default = _default;