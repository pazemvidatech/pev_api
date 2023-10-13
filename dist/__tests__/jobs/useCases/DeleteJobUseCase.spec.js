"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _SubscriptionRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/SubscriptionRepositoryInMemory"));

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _DeleteSubscriptionUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/DeleteSubscriptionUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let categoryRepositoryInMemory;
let subscriptionRepositoryInMemory;
let deleteSubscriptionUseCase;
describe('DeleteSubscriptionUseCase', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    subscriptionRepositoryInMemory = new _SubscriptionRepositoryInMemory.default();
    deleteSubscriptionUseCase = new _DeleteSubscriptionUseCase.default(subscriptionRepositoryInMemory);
  });
  it('should be able to delete a specific subscription', async () => {
    const category = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    const subscription = await subscriptionRepositoryInMemory.create({
      name: 'Professor de Matemática',
      category_id: category.id
    });
    await deleteSubscriptionUseCase.execute(subscription.id);
    expect(subscription).toHaveProperty('id');
    expect(subscription.name).toBe('Professor de Matemática');
  });
  it('should not be able to delete a subscription that does not exist', async () => {
    await expect(deleteSubscriptionUseCase.execute('non-existing-id')).rejects.toEqual(new _AppError.default('This subscription does not exists'));
  });
});