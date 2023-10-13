"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _AdministratorRepositoryInMemory = _interopRequireDefault(require("../../../modules/administrators/repositories/inMemory/AdministratorRepositoryInMemory"));

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _UpdateTypeAdministratorUseCase = _interopRequireDefault(require("../../../modules/administrators/useCases/UpdateTypeAdministratorUseCase"));

var _TypeAdministratorType = _interopRequireDefault(require("../../../modules/administrators/types/TypeAdministratorType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let administratorRepositoryInMemory;
let accountRepositoryInMemory;
let updateTypeAdministratorUseCase;
describe('UpdateTypeAdministratorUseCase', () => {
  beforeEach(() => {
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    administratorRepositoryInMemory = new _AdministratorRepositoryInMemory.default();
    updateTypeAdministratorUseCase = new _UpdateTypeAdministratorUseCase.default(administratorRepositoryInMemory);
  });
  it('should be able to update the type of a specific administrator', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    const administrator = await administratorRepositoryInMemory.create({
      account_id: account.id,
      type: _TypeAdministratorType.default.GOD
    });
    await updateTypeAdministratorUseCase.execute({
      account_id: administrator.account_id,
      new_type: _TypeAdministratorType.default.HERO
    });
    expect(administrator.account_id).toBe(account.id);
    expect(administrator.type).toBe('HERO');
  });
  it('should not be able to update type of an administrator that does not exist', async () => {
    await expect(updateTypeAdministratorUseCase.execute({
      account_id: 'non-existing-id',
      new_type: _TypeAdministratorType.default.HERO
    })).rejects.toEqual(new _AppError.default('Administrator does not exists'));
  });
});