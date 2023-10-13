"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _AdministratorRepositoryInMemory = _interopRequireDefault(require("../../../modules/administrators/repositories/inMemory/AdministratorRepositoryInMemory"));

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _DeleteAdministratorUseCase = _interopRequireDefault(require("../../../modules/administrators/useCases/DeleteAdministratorUseCase"));

var _TypeAdministratorType = _interopRequireDefault(require("../../../modules/administrators/types/TypeAdministratorType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let administratorRepositoryInMemory;
let accountRepositoryInMemory;
let deleteAdministratorUseCase;
describe('DeleteAdministratorUseCase', () => {
  beforeEach(() => {
    administratorRepositoryInMemory = new _AdministratorRepositoryInMemory.default();
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    deleteAdministratorUseCase = new _DeleteAdministratorUseCase.default(administratorRepositoryInMemory);
  });
  it('should be able to delete a specific administrator', async () => {
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
    await deleteAdministratorUseCase.execute(administrator.account_id);
    const findAdministrator = await administratorRepositoryInMemory.findByAccountId(account.id);
    expect(findAdministrator).toBe(undefined);
  });
  it('should not be able to delete a administrator that does not exist', async () => {
    await expect(deleteAdministratorUseCase.execute('non-existing-id')).rejects.toEqual(new _AppError.default('Administrator does not exists'));
  });
});