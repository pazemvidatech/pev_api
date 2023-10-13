"use strict";

var _StateRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/StateRepositoryInMemory"));

var _FindAllStatesUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/FindAllStatesUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let stateRepositoryInMemory;
let findAllStatesUseCase;
describe('FindAllStatesUseCase', () => {
  beforeEach(() => {
    stateRepositoryInMemory = new _StateRepositoryInMemory.default();
    findAllStatesUseCase = new _FindAllStatesUseCase.default(stateRepositoryInMemory);
  });
  it('should be able to find all states', async () => {
    const state1 = await stateRepositoryInMemory.create({
      uf: 'MG',
      name: 'Minas Gerais'
    });
    const state2 = await stateRepositoryInMemory.create({
      uf: 'SP',
      name: 'São Paulo'
    });
    const states = await findAllStatesUseCase.execute();
    expect(states).toEqual([state1, state2]);
  });
});