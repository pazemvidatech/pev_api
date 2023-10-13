"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _IEssayRepository = _interopRequireDefault(require("../repositories/IEssayRepository"));

var _tsyringe = require("tsyringe");

var _IAccountRepository = _interopRequireDefault(require("../../accounts/repositories/IAccountRepository"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _VerifyCreditAccount = _interopRequireDefault(require("../../accounts/utils/VerifyCreditAccount"));

var _EssayStatusEnum = _interopRequireDefault(require("../enums/EssayStatusEnum"));

var _Queue = _interopRequireDefault(require("../../../shared/queues/Queue"));

var _CreateDraftJob = _interopRequireDefault(require("../jobs/CreateDraftJob"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateDraftUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('EssayRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('AccountRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IEssayRepository.default === "undefined" ? Object : _IEssayRepository.default, typeof _IAccountRepository.default === "undefined" ? Object : _IAccountRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class CreateDraftUseCase {
  constructor(essayRepository, accountRepository, cacheProvider) {
    this.essayRepository = essayRepository;
    this.accountRepository = accountRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute({
    accountId,
    image,
    theme
  }) {
    const account = await this.accountRepository.findById(accountId);
    const essayToday = await this.essayRepository.findByAccountIdAndToday(accountId);
    (0, _VerifyCreditAccount.default)({
      account,
      essayToday
    });
    const essay = await this.essayRepository.create({
      accountId,
      text: '',
      theme,
      status: _EssayStatusEnum.default.CONVERTING
    });
    await this.cacheProvider.invalidate(`profile:${accountId}`);
    const token = await this.cacheProvider.recover(`token:${accountId}`);
    await _Queue.default.add(_CreateDraftJob.default.key, {
      image,
      theme,
      essayId: essay.id,
      token
    });
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = CreateDraftUseCase;
exports.default = _default;