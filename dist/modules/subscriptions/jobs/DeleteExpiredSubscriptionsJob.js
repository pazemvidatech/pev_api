"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("reflect-metadata");

var _tsyringe = require("tsyringe");

var _ISubscriptionRepository = _interopRequireDefault(require("../repositories/ISubscriptionRepository"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let DeleteExpiredSubscriptionsJob = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('SubscriptionRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _ISubscriptionRepository.default === "undefined" ? Object : _ISubscriptionRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class DeleteExpiredSubscriptionsJob {
  constructor(subscriptionRepository, cacheProvider) {
    this.subscriptionRepository = subscriptionRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute() {
    await this.subscriptionRepository.removeExpireds(100);
    await this.cacheProvider.invalidatePrefix('profile');
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = DeleteExpiredSubscriptionsJob;
exports.default = _default;