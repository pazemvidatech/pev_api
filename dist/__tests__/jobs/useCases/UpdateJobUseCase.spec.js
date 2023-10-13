"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _SubscriptionRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/SubscriptionRepositoryInMemory"));

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _UpdateSubscriptionUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/UpdateSubscriptionUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let subscriptionRepositoryInMemory;
let categoryRepositoryInMemory;
let updateSubscriptionUseCase;
describe('UpdateSubscription', () => {
  beforeEach(() => {
    subscriptionRepositoryInMemory = new _SubscriptionRepositoryInMemory.default();
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    updateSubscriptionUseCase = new _UpdateSubscriptionUseCase.default(subscriptionRepositoryInMemory, categoryRepositoryInMemory);
  });
  it('should be able to update a specific subscription', async () => {
    const category = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    const subscription = await subscriptionRepositoryInMemory.create({
      name: 'Professor de Matemática',
      category_id: category.id
    });
    await updateSubscriptionUseCase.execute({
      subscription_id: subscription.id,
      new_name: 'Professor de História',
      new_category_id: category.id
    });
    expect(subscription).toHaveProperty('id');
    expect(subscription.name).toBe('Professor de História');
    expect(subscription.category_id).toBe(category.id);
  });
  it('should not be able to update a subscription that does not exist', async () => {
    await expect(updateSubscriptionUseCase.execute({
      subscription_id: 'non-existing-id',
      new_name: 'new_name',
      new_category_id: 'new-category-id'
    })).rejects.toEqual(new _AppError.default('This subscription does not exists'));
  });
  it('should not be able to update a subscription with a existent name', async () => {
    await subscriptionRepositoryInMemory.create({
      name: 'Professor de Matemática',
      category_id: 'category-id'
    });
    const subscription = await subscriptionRepositoryInMemory.create({
      name: 'Professor de História',
      category_id: 'category-id'
    });
    await expect(updateSubscriptionUseCase.execute({
      subscription_id: subscription.id,
      new_name: 'Professor de Matemática',
      new_category_id: 'new-category-id'
    })).rejects.toEqual(new _AppError.default('This subscription already exists'));
  });
  it('should not be able to update a subscription with a non existent category', async () => {
    const subscription = await subscriptionRepositoryInMemory.create({
      name: 'Professor de Matemática',
      category_id: 'category-id'
    });
    await expect(updateSubscriptionUseCase.execute({
      subscription_id: subscription.id,
      new_name: 'Professor de História',
      new_category_id: 'new-category-id'
    })).rejects.toEqual(new _AppError.default('This category does not exists'));
  });
});