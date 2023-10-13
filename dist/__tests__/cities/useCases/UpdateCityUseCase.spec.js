"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CityRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/CityRepositoryInMemory"));

var _StateRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/StateRepositoryInMemory"));

var _UpdateCityUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/UpdateCityUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let cityRepositoryInMemory;
let stateRepositoryInMemory;
let updateCityUseCase;
let state1;
let state2;
describe('UpdateCityUseCase', () => {
  beforeEach(async () => {
    cityRepositoryInMemory = new _CityRepositoryInMemory.default();
    stateRepositoryInMemory = new _StateRepositoryInMemory.default();
    state1 = await stateRepositoryInMemory.create({
      name: 'Minas Gerais',
      uf: 'MG'
    });
    state2 = await stateRepositoryInMemory.create({
      name: 'São Paulo',
      uf: 'SP'
    });
    updateCityUseCase = new _UpdateCityUseCase.default(cityRepositoryInMemory, stateRepositoryInMemory);
  });
  it('should be able to update a specific city', async () => {
    const city = await cityRepositoryInMemory.create({
      state_id: state1.id,
      name: 'Ubá'
    });
    await updateCityUseCase.execute({
      city_id: city.id,
      new_state_id: state2.id,
      new_name: 'São Paulo'
    });
    expect(city).toHaveProperty('id');
    expect(city.name).toBe('São Paulo');
    expect(city.state_id).toBe(state2.id);
  });
  it('should not be able to update a city that does not exist', async () => {
    await expect(updateCityUseCase.execute({
      new_state_id: state1.id,
      city_id: 'non-existing-id',
      new_name: 'Viçosa'
    })).rejects.toEqual(new _AppError.default('This city does not exists'));
  });
  it('should not be able to update a city with state that does not exists', async () => {
    const city = await cityRepositoryInMemory.create({
      state_id: state1.id,
      name: 'Viçosa'
    });
    await expect(updateCityUseCase.execute({
      new_state_id: 'not-existing-id',
      city_id: city.id,
      new_name: 'São Paulo'
    })).rejects.toEqual(new _AppError.default('This state does not exists'));
  });
  it('should not be able to update a city with same name and state id of other city', async () => {
    await cityRepositoryInMemory.create({
      state_id: state2.id,
      name: 'São Paulo'
    });
    const city = await cityRepositoryInMemory.create({
      state_id: state1.id,
      name: 'Viçosa'
    });
    await expect(updateCityUseCase.execute({
      new_state_id: state2.id,
      city_id: city.id,
      new_name: 'São Paulo'
    })).rejects.toEqual(new _AppError.default('This city name already exists'));
  });
});