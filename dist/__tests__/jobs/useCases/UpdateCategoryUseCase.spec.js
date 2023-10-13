"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _UpdateCategoryUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/UpdateCategoryUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let categoryRepositoryInMemory;
let updateCategoryUseCase;
describe('UpdateCategory', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    updateCategoryUseCase = new _UpdateCategoryUseCase.default(categoryRepositoryInMemory);
  });
  it('should be able to update a specific category', async () => {
    const category = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    await updateCategoryUseCase.execute({
      category_id: category.id,
      new_name: 'Lazer'
    });
    expect(category).toHaveProperty('id');
    expect(category.name).toBe('Lazer');
  });
  it('should not be able to update a category that does not exist', async () => {
    await expect(updateCategoryUseCase.execute({
      category_id: 'non-existing-id',
      new_name: 'new_name'
    })).rejects.toEqual(new _AppError.default('This category does not exists'));
  });
  it('should not be able to update a category with a name existent', async () => {
    await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    const category = await categoryRepositoryInMemory.create({
      name: 'Lazer'
    });
    await expect(updateCategoryUseCase.execute({
      category_id: category.id,
      new_name: 'Educação'
    })).rejects.toEqual(new _AppError.default('This category already exists'));
  });
});