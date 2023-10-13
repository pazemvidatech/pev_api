"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CityRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/CityRepositoryInMemory"));

var _DeleteCityUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/DeleteCityUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let cityRepositoryInMemory;
let deleteCityUseCase;
describe('DeleteCityUseCase', () => {
  beforeEach(() => {
    cityRepositoryInMemory = new _CityRepositoryInMemory.default();
    deleteCityUseCase = new _DeleteCityUseCase.default(cityRepositoryInMemory);
  });
  it('should be able to delete a specific city', async () => {
    const city = await cityRepositoryInMemory.create({
      state_id: 'state_id',
      name: 'Viçosa'
    });
    await deleteCityUseCase.execute(city.id);
    const findCity = await cityRepositoryInMemory.findById(city.id);
    expect(findCity).toBe(undefined);
  });
  it('should not be able to delete a city that does not exist', async () => {
    await expect(deleteCityUseCase.execute('non-existing-id')).rejects.toEqual(new _AppError.default('This city does not exists'));
  });
});