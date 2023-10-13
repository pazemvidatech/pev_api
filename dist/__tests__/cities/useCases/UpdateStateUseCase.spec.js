"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _StateRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/StateRepositoryInMemory"));

var _UpdateStateUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/UpdateStateUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let stateRepositoryInMemory;
let updateStateUseCase;
describe('UpdateStateUseCase', () => {
  beforeEach(() => {
    stateRepositoryInMemory = new _StateRepositoryInMemory.default();
    updateStateUseCase = new _UpdateStateUseCase.default(stateRepositoryInMemory);
  });
  it('should be able to update a specific state', async () => {
    const state = await stateRepositoryInMemory.create({
      uf: 'Mg',
      name: 'Mina Gerais'
    });
    await updateStateUseCase.execute({
      state_id: state.id,
      new_name: 'Minas Gerais',
      new_uf: 'MG'
    });
    expect(state).toHaveProperty('id');
    expect(state.name).toBe('Minas Gerais');
    expect(state.uf).toBe('MG');
  });
  it('should not be able to delete a state that does not exist', async () => {
    await expect(updateStateUseCase.execute({
      state_id: 'non-existing-id',
      new_name: 'Minas Gerais',
      new_uf: 'MG'
    })).rejects.toEqual(new _AppError.default('This state does not exists'));
  });
  it('should not be able to delete a state with a name that already exists', async () => {
    await stateRepositoryInMemory.create({
      uf: 'MG',
      name: 'Minas Gerais'
    });
    const state = await stateRepositoryInMemory.create({
      uf: 'SP',
      name: 'São Paulo'
    });
    await expect(updateStateUseCase.execute({
      state_id: state.id,
      new_name: 'Minas Gerais',
      new_uf: 'MG'
    })).rejects.toEqual(new _AppError.default('This state already exists'));
  });
});