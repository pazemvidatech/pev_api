"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _DeleteAccountUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/DeleteAccountUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let accountRepositoryInMemory;
let deleteAccountUseCase;
describe('DeleteAccountUseCase', () => {
  beforeEach(() => {
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    deleteAccountUseCase = new _DeleteAccountUseCase.default(accountRepositoryInMemory);
  });
  it('should be able to delete an account', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    await deleteAccountUseCase.execute(account.id);
    const findAccount = await accountRepositoryInMemory.findById(account.id);
    expect(findAccount).toBe(undefined);
  });
  it('should not be able to delete account with non existing id', async () => {
    await expect(deleteAccountUseCase.execute('non-existing-id')).rejects.toEqual(new _AppError.default('Account does not exists'));
  });
});