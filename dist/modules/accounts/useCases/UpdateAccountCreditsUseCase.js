"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _IAccountRepository = _interopRequireDefault(require("../repositories/IAccountRepository"));

var _ITransactionRepository = _interopRequireDefault(require("../../transactions/repositories/ITransactionRepository"));

var _INotificationProvider = _interopRequireDefault(require("../../../shared/container/providers/NotificationProvider/models/INotificationProvider"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdateAccountCreditsUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('AccountRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('NotificationProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('TransactionRepository')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _IAccountRepository.default === "undefined" ? Object : _IAccountRepository.default, typeof _INotificationProvider.default === "undefined" ? Object : _INotificationProvider.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default, typeof _ITransactionRepository.default === "undefined" ? Object : _ITransactionRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class UpdateAccountCreditsUseCase {
  constructor(accountRepository, notificationProvider, cacheProvider, transactionRepository) {
    this.accountRepository = accountRepository;
    this.notificationProvider = notificationProvider;
    this.cacheProvider = cacheProvider;
    this.transactionRepository = transactionRepository;
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

  async addCashs(account, credits) {
    await this.transactionRepository.create({
      accountId: account.id,
      amount: credits,
      type: 'credit',
      description: 'Compra de pacote'
    });
    await this.sendNotification('Seus citacashs chegaram', `${credits} citacashs foram depositados em sua conta`, account.id);
  }

  async removeCashs(account, credits) {
    await this.transactionRepository.create({
      accountId: account.id,
      amount: credits,
      type: 'debit',
      description: 'Cancelamento de pacote'
    });
    await this.sendNotification('Reembolso concluído', `Você será reembolsado e os citacashs removidos de sua conta`, account.id);
  }

  async execute({
    accountId,
    productId,
    status
  }) {
    const account = await this.accountRepository.findById(accountId);
    const credits = productId.replace('citacash_', '');

    if (account) {
      if (status === 'CANCELLATION' || status === 'EXPIRATION') {
        await this.removeCashs(account, parseInt(credits));
      } else {
        await this.addCashs(account, parseInt(credits));
      }

      await this.cacheProvider.invalidate(`profile:${account.id}`);
    }
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = UpdateAccountCreditsUseCase;
exports.default = _default;