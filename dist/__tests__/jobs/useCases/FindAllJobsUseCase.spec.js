"use strict";

var _SubscriptionRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/SubscriptionRepositoryInMemory"));

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _FindAllSubscriptionsUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/FindAllSubscriptionsUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let categoryRepositoryInMemory;
let subscriptionRepositoryInMemory;
let findSubscriptionUseCase;
describe('FindAllSubscriptionsUseCaseUseCase', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    subscriptionRepositoryInMemory = new _SubscriptionRepositoryInMemory.default();
    findSubscriptionUseCase = new _FindAllSubscriptionsUseCase.default(subscriptionRepositoryInMemory);
  });
  it('should be able to find all subscriptions', async () => {
    const category1 = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    const subscription1 = await subscriptionRepositoryInMemory.create({
      name: 'Professor de Matemática',
      category_id: category1.id
    });
    const subscription2 = await subscriptionRepositoryInMemory.create({
      name: 'Professor de Redação',
      category_id: category1.id
    });
    const subscriptions = await findSubscriptionUseCase.execute();
    expect(subscriptions).toEqual([subscription1, subscription2]);
  });
});