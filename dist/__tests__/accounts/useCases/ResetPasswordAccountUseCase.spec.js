"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _AccountTokenRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountTokenRepositoryInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ResetPasswordAccountUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/ResetPasswordAccountUseCase"));

var _uuid = require("uuid");

var _DayjsDateProvider = _interopRequireDefault(require("../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider"));

var _HashProviderInMemory = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/inMemory/HashProviderInMemory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let accountRepositoryInMemory;
let accountTokenRepositoryInMemory;
let resetPasswordAccountUseCase;
let dateProvider;
let hashProviderInMemory;
describe('ResetPasswordAccountUseCase', () => {
  beforeEach(() => {
    accountTokenRepositoryInMemory = new _AccountTokenRepositoryInMemory.default();
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    dateProvider = new _DayjsDateProvider.default();
    hashProviderInMemory = new _HashProviderInMemory.default();
    resetPasswordAccountUseCase = new _ResetPasswordAccountUseCase.default(accountTokenRepositoryInMemory, dateProvider, hashProviderInMemory, accountRepositoryInMemory);
  });
  describe('Return 200', () => {
    it('should be able to reset password account', async () => {
      const generateHash = jest.spyOn(hashProviderInMemory, 'generateHash');
      const account = await accountRepositoryInMemory.create({
        name: 'Full Name Test',
        email: 'email@test.com',
        phone: '5531900000000',
        password: 'password'
      });
      const token = (0, _uuid.v4)();
      await accountTokenRepositoryInMemory.create({
        account_id: account.id,
        refresh_token: token,
        expires_date: dateProvider.addHours(3)
      });
      await resetPasswordAccountUseCase.execute({
        token,
        password: 'new_password'
      });
      expect(generateHash).toHaveBeenCalledWith('new_password');
      expect(account.password).toBe('new_password');
    });
  });
  describe('Return error 401', () => {
    it('should not be able to reset password account with invalid token', async () => {
      await expect(resetPasswordAccountUseCase.execute({
        token: 'invalid-token',
        password: 'new-password'
      })).rejects.toEqual(new _AppError.default('Token invalid'));
    });
    it('should not be able to reset password account with expired token', async () => {
      jest.spyOn(dateProvider, 'dateNow').mockImplementationOnce(() => {
        return dateProvider.addHours(4);
      });
      const account = await accountRepositoryInMemory.create({
        name: 'Full Name Test',
        email: 'email@test.com',
        phone: '5531900000000',
        password: 'password'
      });
      const token = (0, _uuid.v4)();
      await accountTokenRepositoryInMemory.create({
        account_id: account.id,
        refresh_token: token,
        expires_date: dateProvider.addHours(3)
      });
      await expect(resetPasswordAccountUseCase.execute({
        token,
        password: 'new-password'
      })).rejects.toEqual(new _AppError.default('Token expired'));
    });
  });
});