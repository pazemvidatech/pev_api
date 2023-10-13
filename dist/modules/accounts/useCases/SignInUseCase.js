"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IAuthenticationProvider = _interopRequireDefault(require("../../../shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SignInUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('AuthenticationProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IAuthenticationProvider.default === "undefined" ? Object : _IAuthenticationProvider.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class SignInUseCase {
  constructor(authProvider, cacheProvider) {
    this.authProvider = authProvider;
    this.cacheProvider = cacheProvider;
  }

  async execute({
    email,
    password,
    fmToken
  }) {
    try {
      const response = await this.authProvider.signIn({
        username: email,
        password
      });

      if (fmToken) {
        const {
          id
        } = await this.authProvider.getUser(email);
        await this.cacheProvider.save(`token:${id}`, fmToken);
      }

      return response;
    } catch (error) {
      throw new _AppError.default(error.message, error.statusCode);
    }
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = SignInUseCase;
exports.default = _default;