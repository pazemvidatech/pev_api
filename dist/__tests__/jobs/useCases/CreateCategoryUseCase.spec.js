"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _CreateCategoryUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/CreateCategoryUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let categoryRepositoryInMemory;
let createCategoryUseCase;
describe('CreateCategoryUseCase', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    createCategoryUseCase = new _CreateCategoryUseCase.default(categoryRepositoryInMemory);
  });
  it('should be able to create a new category', async () => {
    const category = await createCategoryUseCase.execute({
      name: 'Educação'
    });
    expect(category).toHaveProperty('id');
    expect(category.name).toBe('Educação');
  });
  it('should not be able to create two categorys with the same name', async () => {
    await createCategoryUseCase.execute({
      name: 'Educação'
    });
    await expect(createCategoryUseCase.execute({
      name: 'Educação'
    })).rejects.toEqual(new _AppError.default('This category already exists'));
  });
});