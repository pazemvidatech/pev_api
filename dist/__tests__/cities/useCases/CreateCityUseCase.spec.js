"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CityRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/CityRepositoryInMemory"));

var _StateRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/StateRepositoryInMemory"));

var _CreateCityUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/CreateCityUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let cityRepositoryInMemory;
let stateRepositoryInMemory;
let createCity;
let state;
describe('CreateCityUseCase', () => {
  beforeEach(async () => {
    cityRepositoryInMemory = new _CityRepositoryInMemory.default();
    stateRepositoryInMemory = new _StateRepositoryInMemory.default();
    createCity = new _CreateCityUseCase.default(cityRepositoryInMemory, stateRepositoryInMemory);
    state = await stateRepositoryInMemory.create({
      name: 'Minas Gerais',
      uf: 'MG'
    });
  });
  it('should be able to create a new city', async () => {
    const city = await createCity.execute({
      state_id: state.id,
      name: 'Viçosa'
    });
    expect(city).toHaveProperty('id');
    expect(city.name).toBe('Viçosa');
  });
  it('should not be able to create city with state that not exists', async () => {
    await expect(createCity.execute({
      name: 'Viçosa',
      state_id: 'non-existing-id'
    })).rejects.toEqual(new _AppError.default('This state does not exists'));
  });
  it('should not be able to create two citys with the same name and state id', async () => {
    await createCity.execute({
      name: 'Viçosa',
      state_id: state.id
    });
    await expect(createCity.execute({
      name: 'Viçosa',
      state_id: state.id
    })).rejects.toEqual(new _AppError.default('This city already exists'));
  });
});