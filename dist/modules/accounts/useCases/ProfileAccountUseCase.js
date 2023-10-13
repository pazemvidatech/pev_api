"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _IAccountRepository = _interopRequireDefault(require("../repositories/IAccountRepository"));

var _AccountMap = require("../mapper/AccountMap");

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IFeatureFlagProvider = _interopRequireDefault(require("../../../shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider"));

var _ITransactionRepository = _interopRequireDefault(require("../../transactions/repositories/ITransactionRepository"));

var _TermsTypeEnum = _interopRequireDefault(require("../enums/TermsTypeEnum"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ProfileAccountUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('AccountRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('FeatureFlagProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('TransactionRepository')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _IAccountRepository.default === "undefined" ? Object : _IAccountRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IFeatureFlagProvider.default === "undefined" ? Object : _IFeatureFlagProvider.default, typeof _ITransactionRepository.default === "undefined" ? Object : _ITransactionRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class ProfileAccountUseCase {
  constructor(accountRepository, cacheProvider, featureFlagProvider, transactionRepository) {
    this.accountRepository = accountRepository;
    this.cacheProvider = cacheProvider;
    this.featureFlagProvider = featureFlagProvider;
    this.transactionRepository = transactionRepository;
  }

  async verifyTermsPrivacy(type, profile) {
    let version;

    if (type === _TermsTypeEnum.default.PRIVACY) {
      const flagPriacyVersion = await this.featureFlagProvider.getConfig('privacyVersion');
      version = Number(flagPriacyVersion);
    } else {
      const flagTermsersion = await this.featureFlagProvider.getConfig('termsVersion');
      version = Number(flagTermsersion);
    }

    if (version === 0) {
      if (type === _TermsTypeEnum.default.PRIVACY) {
        profile.pendingPrivacy = false;
      } else {
        profile.pendingTerms = false;
      }
    } else {
      let haveTerms;

      if (profile.terms) {
        haveTerms = profile.terms.find(e => e.type === type && e.version === version);
      }

      if (!haveTerms) {
        if (type === _TermsTypeEnum.default.PRIVACY) {
          profile.pendingPrivacy = true;
        } else {
          profile.pendingTerms = true;
        }
      }
    }

    return profile;
  }

  async execute(data) {
    const {
      id,
      email,
      name
    } = data;
    const profileCached = await this.cacheProvider.recover(`profile:${id}`);

    if (profileCached != null) {
      await this.verifyTermsPrivacy(_TermsTypeEnum.default.PRIVACY, profileCached);
      await this.verifyTermsPrivacy(_TermsTypeEnum.default.USE, profileCached);
      return profileCached;
    } else {
      let account;
      account = await this.accountRepository.findById(id);
      console.log(account);

      if (!account) {
        const initCitacashs = await this.featureFlagProvider.getConfig('isSignupCitacashs');

        if (initCitacashs === true) {
          account = await this.accountRepository.create({
            name,
            email,
            id
          });
          const citacashsValue = await this.featureFlagProvider.getConfig('SignupCitacashsValue');
          const credits = Number(citacashsValue);
          await this.transactionRepository.create({
            description: 'Citacashs gratuitos',
            amount: credits,
            accountId: account.id,
            type: 'credit'
          });
          account = await this.accountRepository.findById(id);
        }
      }

      const profile = _AccountMap.AccountMap.toDTO(account);

      await this.cacheProvider.save(`profile:${id}`, profile);
      await this.verifyTermsPrivacy(_TermsTypeEnum.default.PRIVACY, profile);
      await this.verifyTermsPrivacy(_TermsTypeEnum.default.USE, profile);
      return profile;
    }
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = ProfileAccountUseCase;
exports.default = _default;