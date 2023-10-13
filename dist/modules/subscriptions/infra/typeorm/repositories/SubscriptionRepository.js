"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = _interopRequireDefault(require("../../../../../shared/infra/typeorm"));

var _Subscription = _interopRequireDefault(require("../entities/Subscription"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SubscriptionRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = _typeorm.default.getRepository(_Subscription.default);
  }

  async create(SubscriptionData) {
    const Subscription = this.ormRepository.create(SubscriptionData);
    return await this.ormRepository.save(Subscription);
  }

  async findById(id) {
    const Subscription = await this.ormRepository.findOne({
      where: {
        id
      }
    });
    return Subscription;
  }

  async findByExternalId(externalId) {
    const Subscription = await this.ormRepository.findOne({
      where: {
        externalId
      }
    });
    return Subscription;
  }

  async findByAccountId(accountId) {
    const Subscription = await this.ormRepository.findOne({
      where: {
        accountId
      }
    });
    return Subscription;
  }

  async findAll() {
    const subscriptions = await this.ormRepository.find();
    return subscriptions;
  }

  async remove(subscription) {
    await this.ormRepository.remove(subscription);
  }

  async save(subscription) {
    await this.ormRepository.save(subscription);
  }

}

var _default = SubscriptionRepository;
exports.default = _default;