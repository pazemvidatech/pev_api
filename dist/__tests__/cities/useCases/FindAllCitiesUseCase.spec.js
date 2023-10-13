"use strict";

var _CityRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/CityRepositoryInMemory"));

var _FindAllCitiesUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/FindAllCitiesUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeCityRepository;
let findAllCityUseCase;
describe('FindAllCitiesUseCase', () => {
  beforeEach(() => {
    fakeCityRepository = new _CityRepositoryInMemory.default();
    findAllCityUseCase = new _FindAllCitiesUseCase.default(fakeCityRepository);
  });
  it('should be able to find all cities', async () => {
    const city1 = await fakeCityRepository.create({
      state_id: 'state-id',
      name: 'Viçosa'
    });
    const city2 = await fakeCityRepository.create({
      state_id: 'state-id',
      name: 'Ubá'
    });
    const cities = await findAllCityUseCase.execute();
    expect(cities).toEqual([city1, city2]);
  });
});