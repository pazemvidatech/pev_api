"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ISubscriptionRepository = _interopRequireDefault(require("../repositories/ISubscriptionRepository"));

var _tsyringe = require("tsyringe");

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _IAccountRepository = _interopRequireDefault(require("../../accounts/repositories/IAccountRepository"));

var _INotificationProvider = _interopRequireDefault(require("../../../shared/container/providers/NotificationProvider/models/INotificationProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SubscriptionWebhookUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('SubscriptionRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('AccountRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _ISubscriptionRepository.default === "undefined" ? Object : _ISubscriptionRepository.default, typeof _IAccountRepository.default === "undefined" ? Object : _IAccountRepository.default, typeof _INotificationProvider.default === "undefined" ? Object : _INotificationProvider.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class SubscriptionWebhookUseCase {
  constructor(subscriptionRepository, accountRepository, notificationProvider, cacheProvider) {
    this.subscriptionRepository = subscriptionRepository;
    this.accountRepository = accountRepository;
    this.notificationProvider = notificationProvider;
    this.cacheProvider = cacheProvider;
  }

  async sendNotification(title, content, accountId) {
    const token = await this.cacheProvider.recover(`token:${accountId}`);

    if (token) {
      await this.notificationProvider.createNotification({
        title,
        content,
        token
      });
    }
  }

  async cancelSubscription(subscription) {
    await this.subscriptionRepository.remove(subscription);
    await this.sendNotification('Assinatura cancelada', 'Sua assinatura do Citaí Premium foi cancelada com sucesso', subscription.accountId);
  }

  async createSubscription({
    accountId,
    platform,
    externalId,
    productId
  }) {
    await this.subscriptionRepository.create({
      name: productId,
      accountId,
      platform: platform,
      externalId
    });
    await this.sendNotification('Assinatura concluída', 'Sua assinatura do Citaí Premium foi concluída com sucesso', accountId);
  }

  async execute({
    accountId,
    status,
    externalId,
    platform,
    productId
  }) {
    const subscription = await this.subscriptionRepository.findByAccountId(accountId);

    if (status === 'EXPIRATION') {
      if (subscription) await this.cancelSubscription(subscription);
    } else {
      if (!subscription) await this.createSubscription({
        accountId,
        platform: platform,
        status,
        externalId,
        productId
      });
    }

    await this.cacheProvider.invalidate(`profile:${accountId}`);
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = SubscriptionWebhookUseCase;
exports.default = _default;