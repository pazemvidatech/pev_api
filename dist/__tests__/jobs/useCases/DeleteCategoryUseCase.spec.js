"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _DeleteCategoryUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/DeleteCategoryUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let categoryRepositoryInMemory;
let deleteCategoryUseCase;
describe('DeleteCategoryUseCase', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    deleteCategoryUseCase = new _DeleteCategoryUseCase.default(categoryRepositoryInMemory);
  });
  it('should be able to delete a specific category', async () => {
    const category = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    await deleteCategoryUseCase.execute(category.id);
    expect(category).toHaveProperty('id');
    expect(category.name).toBe('Educação');
  });
  it('should not be able to delete a category that does not exist', async () => {
    await expect(deleteCategoryUseCase.execute('non-existing-id')).rejects.toEqual(new _AppError.default('This category does not exists'));
  });
});