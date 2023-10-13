"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _UpdateAccountUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/UpdateAccountUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let accountRepositoryInMemory;
let updateAccountUseCase;
describe('UpdateAccountUseCase', () => {
  beforeEach(() => {
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    updateAccountUseCase = new _UpdateAccountUseCase.default(accountRepositoryInMemory);
  });
  it('should be able to update an account', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    await updateAccountUseCase.execute({
      account_id: account.id,
      new_name: 'Account New Name Test',
      new_email: 'newaccountemail@test.com',
      new_phone: 'new-phone'
    });
    expect(account).toHaveProperty('id');
    expect(account.name).toBe('Account New Name Test');
    expect(account.email).toBe('newaccountemail@test.com');
    expect(account.password).toBe('password');
    expect(account.phone).toBe('new-phone');
  });
  it('should not be able to update account with non existing id', async () => {
    await expect(updateAccountUseCase.execute({
      account_id: 'non-existing-id',
      new_name: 'Account New Name Test',
      new_email: 'newaccountemail@test.com',
      new_phone: 'new-phone'
    })).rejects.toEqual(new _AppError.default('Account does not exists'));
  });
});