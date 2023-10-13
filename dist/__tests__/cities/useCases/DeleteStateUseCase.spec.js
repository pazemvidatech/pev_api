"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _StateRepositoryInMemory = _interopRequireDefault(require("../../../modules/cities/repositories/inMemory/StateRepositoryInMemory"));

var _DeleteStateUseCase = _interopRequireDefault(require("../../../modules/cities/useCases/DeleteStateUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let stateRepositoryInMemory;
let deleteStateUseCase;
describe('DeleteStateUseCase', () => {
  beforeEach(() => {
    stateRepositoryInMemory = new _StateRepositoryInMemory.default();
    deleteStateUseCase = new _DeleteStateUseCase.default(stateRepositoryInMemory);
  });
  it('should be able to delete a specific state', async () => {
    const state = await stateRepositoryInMemory.create({
      uf: 'MG',
      name: 'Minas Gerais'
    });
    await deleteStateUseCase.execute(state.id);
    const findState = await stateRepositoryInMemory.findById(state.id);
    expect(findState).toBe(undefined);
  });
  it('should not be able to delete a state that does not exist', async () => {
    await expect(deleteStateUseCase.execute('non-existing-id')).rejects.toEqual(new _AppError.default('This state does not exists'));
  });
});