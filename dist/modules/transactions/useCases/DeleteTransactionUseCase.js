"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _ITransactionRepository = _interopRequireDefault(require("../repositories/ITransactionRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _tsyringe = require("tsyringe");

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let DeleteTransaction = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('TransactionRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _ITransactionRepository.default === "undefined" ? Object : _ITransactionRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class DeleteTransaction {
  constructor(transactionRepository, cacheProvider) {
    this.transactionRepository = transactionRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute(id) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) throw new _AppError.default('This transaction does not exists');
    await this.transactionRepository.remove(transaction);
    await this.cacheProvider.invalidate(`profile:${transaction.accountId}`);
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = DeleteTransaction;
exports.default = _default;