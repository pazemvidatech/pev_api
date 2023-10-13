"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _IFeatureFlagProvider = _interopRequireDefault(require("../../../shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider"));

var _TermsTypeEnum = _interopRequireDefault(require("../enums/TermsTypeEnum"));

var _ITermsRepository = _interopRequireDefault(require("../repositories/ITermsRepository"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let AcceptTermsUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('FeatureFlagProvider')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('TermsRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IFeatureFlagProvider.default === "undefined" ? Object : _IFeatureFlagProvider.default, typeof _ITermsRepository.default === "undefined" ? Object : _ITermsRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class AcceptTermsUseCase {
  constructor(featureFlagProvider, termsRepository, cacheProvider) {
    this.featureFlagProvider = featureFlagProvider;
    this.termsRepository = termsRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute(data) {
    const {
      accountId,
      type
    } = data;
    let version;

    if (type === _TermsTypeEnum.default.PRIVACY) {
      const flagPriacyVersion = await this.featureFlagProvider.getConfig('privacyVersion');
      version = Number(flagPriacyVersion);
    } else {
      const flagTermsersion = await this.featureFlagProvider.getConfig('termsVersion');
      version = Number(flagTermsersion);
    }

    const termsAccount = await this.termsRepository.findByAccountIdAndVersion({
      accountId,
      version,
      type
    });

    if (!termsAccount && version !== 0) {
      await this.termsRepository.create({
        version,
        accountId,
        type: type
      });
      await this.cacheProvider.invalidate(`profile:${accountId}`);
    }
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = AcceptTermsUseCase;
exports.default = _default;