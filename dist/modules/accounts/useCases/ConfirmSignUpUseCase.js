"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IAuthenticationProvider = _interopRequireDefault(require("../../../shared/container/providers/AuthenticationProvider/models/IAuthenticationProvider"));

var _IAccountRepository = _interopRequireDefault(require("../repositories/IAccountRepository"));

var _IFeatureFlagProvider = _interopRequireDefault(require("../../../shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider"));

var _ITransactionRepository = _interopRequireDefault(require("../../transactions/repositories/ITransactionRepository"));

var _ITermsRepository = _interopRequireDefault(require("../repositories/ITermsRepository"));

var _TermsTypeEnum = _interopRequireDefault(require("../enums/TermsTypeEnum"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ConfirmSignUpUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('AuthenticationProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('AccountRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('TransactionRepository')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('FeatureFlagProvider')(target, undefined, 3);
}, _dec6 = function (target, key) {
  return (0, _tsyringe.inject)('TermsRepository')(target, undefined, 4);
}, _dec7 = Reflect.metadata("design:type", Function), _dec8 = Reflect.metadata("design:paramtypes", [typeof _IAuthenticationProvider.default === "undefined" ? Object : _IAuthenticationProvider.default, typeof _IAccountRepository.default === "undefined" ? Object : _IAccountRepository.default, typeof _ITransactionRepository.default === "undefined" ? Object : _ITransactionRepository.default, typeof _IFeatureFlagProvider.default === "undefined" ? Object : _IFeatureFlagProvider.default, typeof _ITermsRepository.default === "undefined" ? Object : _ITermsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = _dec8(_class = class ConfirmSignUpUseCase {
  constructor(authProvider, accountsRepository, transactionRepository, featureFlagProvider, termsRepository) {
    this.authProvider = authProvider;
    this.accountsRepository = accountsRepository;
    this.transactionRepository = transactionRepository;
    this.featureFlagProvider = featureFlagProvider;
    this.termsRepository = termsRepository;
  }

  async execute({
    email,
    code
  }) {
    try {
      await this.authProvider.confirmSignUp({
        username: email,
        code
      });
      const {
        id,
        name
      } = await this.authProvider.getUser(email);
      const account = await this.accountsRepository.create({
        id,
        email,
        name
      });
      const initCitacashs = await this.featureFlagProvider.getConfig('isSignupCitacashs');
      const versionsUseTerms = Number(await this.featureFlagProvider.getConfig('termsVersion'));
      const versionsPrivacy = Number(await this.featureFlagProvider.getConfig('privacyVersion'));

      if (versionsUseTerms > 0) {
        await this.termsRepository.create({
          version: versionsUseTerms,
          type: _TermsTypeEnum.default.USE,
          accountId: account.id
        });
      }

      if (versionsPrivacy > 0) {
        await this.termsRepository.create({
          version: versionsPrivacy,
          type: _TermsTypeEnum.default.PRIVACY,
          accountId: account.id
        });
      }

      if (initCitacashs === true) {
        const citacashsValue = await this.featureFlagProvider.getConfig('SignupCitacashsValue');
        const credits = Number(citacashsValue);
        await this.transactionRepository.create({
          description: 'Citacashs gratuitos',
          amount: credits,
          accountId: account.id,
          type: 'credit'
        });
      }
    } catch (error) {
      throw new _AppError.default(error.message, error.statusCode);
    }
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = ConfirmSignUpUseCase;
exports.default = _default;