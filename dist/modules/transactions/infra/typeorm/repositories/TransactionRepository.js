"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = _interopRequireDefault(require("../../../../../shared/infra/typeorm"));

var _Transaction = _interopRequireDefault(require("../entities/Transaction"));

var _Account = _interopRequireDefault(require("../../../../accounts/infra/typeorm/entities/Account"));

var _classTransformer = require("class-transformer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransactionRepository {
  constructor() {
    this.ormRepository = void 0;
    this.connection = void 0;
    this.connection = _typeorm.default;
    this.ormRepository = _typeorm.default.getRepository(_Transaction.default);
  }

  async create(transactionData) {
    return await this.connection.transaction(async entityManager => {
      const tran = new _Transaction.default();
      tran.description = transactionData.description;
      tran.externalId = transactionData.externalId;
      tran.accountId = transactionData.accountId;
      tran.amount = transactionData.amount;
      tran.type = transactionData.type;
      await entityManager.save(tran);
      const account = await entityManager.findOneBy(_Account.default, {
        id: transactionData.accountId
      });
      const isCredit = tran.type === 'credit';
      account.credits = isCredit ? account.credits + tran.amount : account.credits - tran.amount;
      await entityManager.save(account);
      return tran;
    });
  }

  async findById(id) {
    const Transaction = await this.ormRepository.findOne({
      where: {
        id
      }
    });
    return Transaction;
  }

  async findByExternalId(externalId) {
    const Transaction = await this.ormRepository.findOne({
      where: {
        externalId
      }
    });
    return Transaction;
  }

  async findByAccountId(accountId) {
    const Transaction = await this.ormRepository.findOne({
      where: {
        accountId
      }
    });
    return Transaction;
  }

  async findAll(query) {
    const transactions = await this.ormRepository.findAndCount(query);
    return {
      data: (0, _classTransformer.classToPlain)(transactions[0]),
      total: transactions[1]
    };
  }

  async remove(transaction) {
    await this.connection.transaction(async entityManager => {
      await entityManager.remove(transaction);
      const account = await entityManager.findOneBy(_Account.default, {
        id: transaction.accountId
      });
      const isCredit = transaction.type === 'credit';
      account.credits = isCredit ? account.credits - transaction.amount : account.credits + transaction.amount;
      await entityManager.save(account);
    });
  }

  async save(transaction) {
    await this.ormRepository.save(transaction);
  }

}

var _default = TransactionRepository;
exports.default = _default;