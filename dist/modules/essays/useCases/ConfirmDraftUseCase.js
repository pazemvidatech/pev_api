"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _IEssayRepository = _interopRequireDefault(require("../repositories/IEssayRepository"));

var _tsyringe = require("tsyringe");

var _jobs = require("../jobs");

var _Queue = _interopRequireDefault(require("../../../shared/queues/Queue"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IFeatureFlagProvider = _interopRequireDefault(require("../../../shared/container/providers/FeatureFlagProvider/models/IFeatureFlagProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _EssayStatusEnum = _interopRequireDefault(require("../enums/EssayStatusEnum"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ConfirmDraftUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('EssayRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('FeatureFlagProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IEssayRepository.default === "undefined" ? Object : _IEssayRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _IFeatureFlagProvider.default === "undefined" ? Object : _IFeatureFlagProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class ConfirmDraftUseCase {
  constructor(essayRepository, cacheProvider, featureFlagProvider) {
    this.essayRepository = essayRepository;
    this.cacheProvider = cacheProvider;
    this.featureFlagProvider = featureFlagProvider;
  }

  async execute({
    accountId,
    text,
    theme,
    essayId,
    isFour
  }) {
    const essay = await this.essayRepository.findById(essayId);
    if (!essay) throw new _AppError.default('Essay not found', 404);
    if (essay.accountId !== accountId) throw new _AppError.default('Essay not found', 404);
    essay.text = text;
    essay.theme = theme;
    essay.status = _EssayStatusEnum.default.PENDING;
    await this.essayRepository.save(essay);
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

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = ConfirmDraftUseCase;
exports.default = _default;