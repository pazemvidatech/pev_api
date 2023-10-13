"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _HashProviderInMemory = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/inMemory/HashProviderInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CreateAccountUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/CreateAccountUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let accountRepositoryInMemory;
let createAccountUseCase;
let hashProviderInMemory;
describe('CreateAccountUseCase', () => {
  beforeEach(() => {
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    hashProviderInMemory = new _HashProviderInMemory.default();
    createAccountUseCase = new _CreateAccountUseCase.default(accountRepositoryInMemory, hashProviderInMemory);
  });
  it('should be able to create an account', async () => {
    const account = await createAccountUseCase.execute({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    expect(account).toHaveProperty('id');
    expect(account.name).toBe('Account Name Test');
    expect(account.email).toBe('accountemail@test.com');
    expect(account.password).toBe('password');
    expect(account.phone).toBe('phone');
  });
  it('should not be able to create two accounts with same email', async () => {
    await createAccountUseCase.execute({
      name: 'Account Name Test2',
      email: 'accountemail2@test.com',
      password: 'password',
      phone: 'phone2'
    });
    await expect(createAccountUseCase.execute({
      name: 'Account Name Test2',
      email: 'accountemail2@test.com',
      password: 'password',
      phone: 'phone3'
    })).rejects.toEqual(new _AppError.default('Email already in use'));
  });
  it('should not be able to create two accounts with same phone', async () => {
    await createAccountUseCase.execute({
      name: 'Account Name Test3',
      email: 'accountemail3@test.com',
      password: 'password',
      phone: 'phone3'
    });
    await expect(createAccountUseCase.execute({
      name: 'Account Name Test3',
      email: 'accountemail4@test.com',
      password: 'password',
      phone: 'phone3'
    })).rejects.toEqual(new _AppError.default('Phone already in use'));
  });
});