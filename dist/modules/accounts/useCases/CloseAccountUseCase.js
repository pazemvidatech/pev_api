"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IAuthenticationProvider = _interopRequireDefault(require("../../../shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider"));

var _IAccountRepository = _interopRequireDefault(require("../repositories/IAccountRepository"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CloseAccountUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('AuthenticationProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('AccountRepository')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IAuthenticationProvider.default === "undefined" ? Object : _IAuthenticationProvider.default, typeof _IAccountRepository.default === "undefined" ? Object : _IAccountRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class CloseAccountUseCase {
  constructor(authProvider, accountRepository) {
    this.authProvider = authProvider;
    this.accountRepository = accountRepository;
  }

  async execute(accountId) {
    try {
      const account = await this.accountRepository.findById(accountId);
      if (!account) throw new _AppError.default('Account not found', 404);
      await this.authProvider.closeAccount(account.email);
      await this.accountRepository.remove(account);
    } catch (error) {
      throw new _AppError.default(error.message, error.statusCode);
    }
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = CloseAccountUseCase;
exports.default = _default;