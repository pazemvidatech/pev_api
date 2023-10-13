"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _StateRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/StateRepositoryInMemory"));

var _CreateStateUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/CreateStateUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let stateRepositoryInMemory;
let createStateUseCase;
describe('CreateStateUseCase', () => {
  beforeEach(() => {
    stateRepositoryInMemory = new _StateRepositoryInMemory.default();
    createStateUseCase = new _CreateStateUseCase.default(stateRepositoryInMemory);
  });
  it('should be able to create a new state', async () => {
    const state = await createStateUseCase.execute({
      uf: 'MG',
      name: 'Minas Gerais'
    });
    expect(state).toHaveProperty('id');
    expect(state.name).toBe('Minas Gerais');
    expect(state.uf).toBe('MG');
  });
  it('should not be able to create two states with the same name', async () => {
    await createStateUseCase.execute({
      name: 'Minas Gerais',
      uf: 'MG'
    });
    await expect(createStateUseCase.execute({
      name: 'Minas Gerais',
      uf: 'MG'
    })).rejects.toEqual(new _AppError.default('This state already exists'));
  });
});