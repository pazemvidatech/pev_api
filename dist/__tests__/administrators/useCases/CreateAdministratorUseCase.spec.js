"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _AdministratorRepositoryInMemory = _interopRequireDefault(require("../../../modules/administrators/repositories/inMemory/AdministratorRepositoryInMemory"));

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _CreateAdministratorUseCase = _interopRequireDefault(require("../../../modules/administrators/useCases/CreateAdministratorUseCase"));

var _TypeAdministratorType = _interopRequireDefault(require("../../../modules/administrators/types/TypeAdministratorType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let administratorRepositoryInMemory;
let accountRepositoryInMemory;
let createAdministrator;
describe('CreateAdministratorUseCase', () => {
  beforeEach(() => {
    administratorRepositoryInMemory = new _AdministratorRepositoryInMemory.default();
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    createAdministrator = new _CreateAdministratorUseCase.default(administratorRepositoryInMemory, accountRepositoryInMemory);
  });
  it('should be able to create a new administrator', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    const administrator = await createAdministrator.execute({
      account_id: account.id,
      type: _TypeAdministratorType.default.GOD
    });
    expect(administrator.type).toBe('GOD');
    expect(administrator.account_id).toBe(account.id);
  });
  it('should not be able to create administrator with non existing account id', async () => {
    await expect(createAdministrator.execute({
      account_id: 'non-existing-id',
      type: _TypeAdministratorType.default.GOD
    })).rejects.toEqual(new _AppError.default('Account does not exists'));
  });
  it('should not be able to create two administrators with same account id', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail2@test.com',
      password: 'password',
      phone: 'phone2'
    });
    await createAdministrator.execute({
      account_id: account.id,
      type: _TypeAdministratorType.default.GOD
    });
    await expect(createAdministrator.execute({
      account_id: account.id,
      type: _TypeAdministratorType.default.GOD
    })).rejects.toEqual(new _AppError.default('Administrator already exists'));
  });
});