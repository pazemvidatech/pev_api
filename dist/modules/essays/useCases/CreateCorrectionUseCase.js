"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ICorrectionRepository = _interopRequireDefault(require("../repositories/ICorrectionRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _tsyringe = require("tsyringe");

var _IEssayRepository = _interopRequireDefault(require("../repositories/IEssayRepository"));

var _CreateCorrectionJob = _interopRequireDefault(require("../jobs/CreateCorrectionJob"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateCorrectionUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('EssayRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CorrectionRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IEssayRepository.default === "undefined" ? Object : _IEssayRepository.default, typeof _ICorrectionRepository.default === "undefined" ? Object : _ICorrectionRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class CreateCorrectionUseCase {
  constructor(essayRepository, correctionRepository, cacheProvider) {
    this.essayRepository = essayRepository;
    this.correctionRepository = correctionRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute(essayId) {
    const essay = await this.essayRepository.findById(essayId);
    if (!essay) throw new _AppError.default('Essay not found', 404);
    const token = await this.cacheProvider.recover(`token:${essay.accountId}`);
    const job = _CreateCorrectionJob.default.handle;
    const {
      prompt,
      completion
    } = await job({
      essayId,
      text: essay.text,
      theme: essay.theme,
      token
    });
    let correction;
    const correctionExists = await this.correctionRepository.findByEssayId(essayId);

    if (correctionExists) {
      correctionExists.completion = completion;
      correctionExists.prompt = prompt;
      await this.correctionRepository.save(correctionExists);
      correction = correctionExists;
    } else {
      correction = await this.correctionRepository.create({
        essayId,
        prompt,
        completion
      });
    }

    return correction;
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = CreateCorrectionUseCase;
exports.default = _default;