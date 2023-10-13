"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ITransactionRepository = _interopRequireDefault(require("../repositories/ITransactionRepository"));

var _tsyringe = require("tsyringe");

var _IPaymentProvider = _interopRequireDefault(require("../../../shared/container/providers/PaymentProvider/models/IPaymentProvider"));

var _PaymentStatusEnum = require("../../../shared/container/providers/PaymentProvider/models/enums/PaymentStatusEnum");

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _INotificationProvider = _interopRequireDefault(require("../../../shared/container/providers/NotificationProvider/models/INotificationProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let TransactionWebhookUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('TransactionRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('PaymentProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationProvider')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _ITransactionRepository.default === "undefined" ? Object : _ITransactionRepository.default, typeof _IPaymentProvider.default === "undefined" ? Object : _IPaymentProvider.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _INotificationProvider.default === "undefined" ? Object : _INotificationProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class TransactionWebhookUseCase {
  constructor(transactionRepository, paymentProvider, cacheProvider, notificationProvider) {
    this.transactionRepository = transactionRepository;
    this.paymentProvider = paymentProvider;
    this.cacheProvider = cacheProvider;
    this.notificationProvider = notificationProvider;
  }

  async createTransaction(metadata, externalId) {
    const amount = metadata.package.amount;
    await this.transactionRepository.create({
      description: 'Compra de citacashs',
      accountId: metadata.account_id,
      type: 'credit',
      amount,
      externalId
    });
    const token = await this.cacheProvider.recover(`token:${metadata.account_id}`);

    if (token) {
      const amount = metadata.package.amount;
      await this.notificationProvider.createNotification({
        token,
        title: 'Compra de citacashs',
        content: `Foram depositados em sua conta ${amount} citacashs`
      });
    }
  }

  async deleteTransaction(metadata, externalId) {
    const amount = metadata.package.amount;
    await this.transactionRepository.create({
      description: 'Estorno de citacashs',
      accountId: metadata.account_id,
      type: 'debit',
      amount,
      externalId
    });
    const token = await this.cacheProvider.recover(`token:${metadata.account_id}`);

    if (token) {
      const amount = metadata.package.amount;
      await this.notificationProvider.createNotification({
        token,
        title: 'Estorno de citacashs',
        content: `Foram estornados de sua conta ${amount} citacashs`
      });
    }
  }

  async execute(paymentId) {
    const {
      metadata,
      status
    } = await this.paymentProvider.getPayment(paymentId);
    const transaction = await this.transactionRepository.findByExternalId(paymentId.toString());

    if (status === _PaymentStatusEnum.PaymentStatusEnum.authorized || status === _PaymentStatusEnum.PaymentStatusEnum.approved) {
      if (!transaction) await this.createTransaction(metadata, paymentId.toString());
    } else {
      if (transaction) await this.deleteTransaction(metadata, paymentId.toString());
    }

    await this.cacheProvider.invalidate(`profile:${metadata.account_id}`);
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = TransactionWebhookUseCase;
exports.default = _default;