"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Subscription = _interopRequireDefault(require("../../infra/typeorm/entities/Subscription"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SubscriptionRepositoryInMemory {
  constructor() {
    this.subscriptions = [];
  }

  async create(subscriptionData) {
    const {
      name,
      accountId,
      platform,
      externalId
    } = subscriptionData;
    const subscription = new _Subscription.default();
    Object.assign(subscription, {
      id: (0, _uuid.v4)(),
      name,
      accountId,
      platform,
      externalId
    });
    this.subscriptions.push(subscription);
    return subscription;
  }

  async findById(id) {
    const subscription = this.subscriptions.find(subscription => subscription.id === id);
    return subscription;
  }

  async findByExternalId(externalId) {
    const subscription = this.subscriptions.find(subscription => subscription.externalId === externalId);
    return subscription;
  }

  async findByAccountId(externalId) {
    const subscription = this.subscriptions.find(subscription => subscription.accountId === externalId);
    return subscription;
  }

  async findAll() {
    const subscriptions = this.subscriptions;
    return subscriptions;
  }

  async remove(subscription) {
    const findIndex = this.subscriptions.findIndex(findsubscription => findsubscription === subscription);
    this.subscriptions.splice(findIndex, 1);
  }

  async save(subscription) {
    const findIndex = this.subscriptions.findIndex(findsubscription => findsubscription.id === subscription.id);
    this.subscriptions[findIndex] = subscription;
  }

}

var _default = SubscriptionRepositoryInMemory;
exports.default = _default;