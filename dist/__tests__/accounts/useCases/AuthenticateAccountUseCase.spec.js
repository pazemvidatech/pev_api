"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _AccountTokenRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountTokenRepositoryInMemory"));

var _DayjsDateProvider = _interopRequireDefault(require("../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider"));

var _HashProviderInMemory = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/inMemory/HashProviderInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _AuthenticateAccountUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/AuthenticateAccountUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let authenticateAccountUseCase;
let accountRepositoryInMemory;
let accountsTokensRepositoryInMemory;
let dateProvider;
let hashProviderInMemory;
describe('AuthenticateAccountUseCase', () => {
  beforeEach(() => {
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    accountsTokensRepositoryInMemory = new _AccountTokenRepositoryInMemory.default();
    dateProvider = new _DayjsDateProvider.default();
    hashProviderInMemory = new _HashProviderInMemory.default();
    authenticateAccountUseCase = new _AuthenticateAccountUseCase.default(accountRepositoryInMemory, accountsTokensRepositoryInMemory, dateProvider, hashProviderInMemory);
  });
  describe('Success', () => {
    it('should be able to authenticate an account', async () => {
      const account = await accountRepositoryInMemory.create({
        name: 'Account Name Test',
        email: 'accountemail@test.com',
        phone: 'phone',
        password: 'correct_password'
      });
      const authenticatedAccount = await authenticateAccountUseCase.execute({
        email: account.email,
        password: account.password
      });
      expect(authenticatedAccount).toHaveProperty('token');
      expect(authenticatedAccount).toHaveProperty('refresh_token');
      expect(authenticatedAccount).toHaveProperty('account');
    });
  });
  describe('Error', () => {
    it('should not be able to authenticate a non existent account', async () => {
      await expect(authenticateAccountUseCase.execute({
        email: 'nonexistingaccountemail@test.com',
        password: 'correct_password'
      })).rejects.toEqual(new _AppError.default('Credentials incorrect', 401));
    });
    it('should not be able to authenticate a account with incorrect password', async () => {
      const account = await accountRepositoryInMemory.create({
        name: 'Account Name Test',
        email: 'email@test.com',
        phone: 'phone',
        password: 'correct_password'
      });
      await expect(authenticateAccountUseCase.execute({
        email: account.email,
        password: 'incorrect_password'
      })).rejects.toEqual(new _AppError.default('Credentials incorrect', 401));
    });
  });
});