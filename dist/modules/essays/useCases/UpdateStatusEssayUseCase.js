"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _IEssayRepository = _interopRequireDefault(require("../repositories/IEssayRepository"));

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _INotificationProvider = _interopRequireDefault(require("../../../shared/container/providers/NotificationProvider/models/INotificationProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdateStatusEssayUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('EssayRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IEssayRepository.default === "undefined" ? Object : _IEssayRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _INotificationProvider.default === "undefined" ? Object : _INotificationProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class UpdateStatusEssayUseCase {
  constructor(essayRepository, cacheProvider, notificationProvider) {
    this.essayRepository = essayRepository;
    this.cacheProvider = cacheProvider;
    this.notificationProvider = notificationProvider;
  }

  async execute({
    newStatus,
    id
  }) {
    const essay = await this.essayRepository.findById(id);
    if (!essay) throw new _AppError.default('This essay does not exists');
    essay.status = newStatus;
    await this.essayRepository.save(essay);
    const token = await this.cacheProvider.recover(`token:${essay.accountId}`);

    if (token) {
      const theme = essay.theme;
      await this.notificationProvider.createNotification({
        token,
        title: 'Redação respondida!',
        content: `A sua redação do tema "${theme}" foi respondida`
      });
    }
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = UpdateStatusEssayUseCase;
exports.default = _default;