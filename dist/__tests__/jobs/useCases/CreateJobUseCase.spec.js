"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _SubscriptionRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/SubscriptionRepositoryInMemory"));

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _CreateSubscriptionUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/CreateSubscriptionUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let categoryRepositoryInMemory;
let subscriptionRepositoryInMemory;
let createSubscriptionUseCase;
describe('CreateSubscriptionUseCase', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    subscriptionRepositoryInMemory = new _SubscriptionRepositoryInMemory.default();
    createSubscriptionUseCase = new _CreateSubscriptionUseCase.default(subscriptionRepositoryInMemory, categoryRepositoryInMemory);
  });
  it('should be able to create a new subscription', async () => {
    const category = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    const subscription = await createSubscriptionUseCase.execute({
      name: 'Professor de Matemática',
      category_id: category.id
    });
    expect(subscription).toHaveProperty('id');
    expect(subscription.name).toBe('Professor de Matemática');
  });
  it('should not be able to create two subscriptions with the same name', async () => {
    const category = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    await createSubscriptionUseCase.execute({
      name: 'Professor de Matemática',
      category_id: category.id
    });
    await expect(createSubscriptionUseCase.execute({
      name: 'Professor de Matemática',
      category_id: category.id
    })).rejects.toEqual(new _AppError.default('This subscription already exists'));
  });
  it('should not be able to create a new subscription with not exist category', async () => {
    await expect(createSubscriptionUseCase.execute({
      name: 'Professor de Português',
      category_id: 'non-existing-id'
    })).rejects.toEqual(new _AppError.default('This category does not exists'));
  });
});