"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Transaction = _interopRequireDefault(require("../../infra/typeorm/entities/Transaction"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransactionRepositoryInMemory {
  constructor() {
    this.transactions = [];
  }

  async create(subscriptionData) {
    const {
      description,
      accountId,
      amount,
      type
    } = subscriptionData;
    const subscription = new _Transaction.default();
    Object.assign(subscription, {
      id: (0, _uuid.v4)(),
      description,
      accountId,
      amount,
      type
    });
    this.transactions.push(subscription);
    return subscription;
  }

  async findById(id) {
    const subscription = this.transactions.find(subscription => subscription.id === id);
    return subscription;
  }

  async findByExternalId(externalId) {
    const subscription = this.transactions.find(subscription => subscription.externalId === externalId);
    return subscription;
  }

  async findByAccountId(externalId) {
    const subscription = this.transactions.find(subscription => subscription.accountId === externalId);
    return subscription;
  }

  async findAll(data) {
    const transactions = this.transactions.filter(e => e.accountId === data.where.accountId);
    return {
      data: transactions,
      total: transactions.length
    };
  }

  async remove(subscription) {
    const findIndex = this.transactions.findIndex(findsubscription => findsubscription === subscription);
    this.transactions.splice(findIndex, 1);
  }

  async save(subscription) {
    const findIndex = this.transactions.findIndex(findsubscription => findsubscription.id === subscription.id);
    this.transactions[findIndex] = subscription;
  }

}

var _default = TransactionRepositoryInMemory;
exports.default = _default;