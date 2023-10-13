"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _IEssayRepository = _interopRequireDefault(require("../repositories/IEssayRepository"));

var _tsyringe = require("tsyringe");

var _jobs = require("../jobs");

var _Queue = _interopRequireDefault(require("../../../shared/queues/Queue"));

var _IAccountRepository = _interopRequireDefault(require("../../accounts/repositories/IAccountRepository"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IFeatureFlagProvider = _interopRequireDefault(require("../../../shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateEssayUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('EssayRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('AccountRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('FeatureFlagProvider')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _IEssayRepository.default === "undefined" ? Object : _IEssayRepository.default, typeof _IAccountRepository.default === "undefined" ? Object : _IAccountRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IFeatureFlagProvider.default === "undefined" ? Object : _IFeatureFlagProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class CreateEssayUseCase {
  constructor(essayRepository, accountRepository, cacheProvider, featureFlagProvider) {
    this.essayRepository = essayRepository;
    this.accountRepository = accountRepository;
    this.cacheProvider = cacheProvider;
    this.featureFlagProvider = featureFlagProvider;
  }

  async execute({
    accountId,
    text,
    theme,
    isFour
  }) {
    const essay = await this.essayRepository.create({
      accountId,
      text,
      theme
    });
    await this.cacheProvider.invalidate(`profile:${accountId}`);
    const token = await this.cacheProvider.recover(`token:${accountId}`);
    const automaticFlag = await this.featureFlagProvider.getConfig('automaticCorrection');
    await _Queue.default.add(_jobs.CreateCorrectionJob.key, {
      text,
      theme,
      essayId: essay.id,
      token,
      automaticFlag,
      isFour
    });
    return essay;
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = CreateEssayUseCase;
exports.default = _default;