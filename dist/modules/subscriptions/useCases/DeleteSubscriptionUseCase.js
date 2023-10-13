"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _ISubscriptionRepository = _interopRequireDefault(require("../repositories/ISubscriptionRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _tsyringe = require("tsyringe");

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let DeleteSubscription = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('SubscriptionRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _ISubscriptionRepository.default === "undefined" ? Object : _ISubscriptionRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class DeleteSubscription {
  constructor(subscriptionRepository, cacheProvider) {
    this.subscriptionRepository = subscriptionRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute(id) {
    const checkSubscriptionExists = await this.subscriptionRepository.findById(id);
    if (!checkSubscriptionExists) throw new _AppError.default('This subscription does not exists');
    await this.subscriptionRepository.remove(checkSubscriptionExists);
    await this.cacheProvider.invalidate(`profile:${checkSubscriptionExists.accountId}`);
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = DeleteSubscription;
exports.default = _default;