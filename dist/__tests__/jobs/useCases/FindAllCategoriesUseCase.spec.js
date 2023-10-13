"use strict";

var _CategoryRepositoryInMemory = _interopRequireDefault(require("../../../modules/subscriptions/repositories/inMemory/CategoryRepositoryInMemory"));

var _FindAllCategoriesUseCase = _interopRequireDefault(require("../../../modules/subscriptions/useCases/FindAllCategoriesUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let categoryRepositoryInMemory;
let findCategoryUseCase;
describe('FindAllCategoriesUseCase', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoryRepositoryInMemory.default();
    findCategoryUseCase = new _FindAllCategoriesUseCase.default(categoryRepositoryInMemory);
  });
  it('should be able to find all categories', async () => {
    const category1 = await categoryRepositoryInMemory.create({
      name: 'Educação'
    });
    const category2 = await categoryRepositoryInMemory.create({
      name: 'Lazer'
    });
    const categories = await findCategoryUseCase.execute();
    expect(categories).toEqual([category1, category2]);
  });
});