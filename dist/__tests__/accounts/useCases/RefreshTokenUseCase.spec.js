"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _AccountTokenRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountTokenRepositoryInMemory"));

var _HashProviderInMemory = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/inMemory/HashProviderInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _RefreshTokenUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/RefreshTokenUseCase"));

var _AuthenticateAccountUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/AuthenticateAccountUseCase"));

var _DayjsDateProvider = _interopRequireDefault(require("../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider"));

var _jsonwebtoken = require("jsonwebtoken");

var _auth = _interopRequireDefault(require("../../../config/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let accountRepositoryInMemory;
let accountTokenRepositoryInMemory;
let refreshTokenUseCase;
let authenticateAccountUseCase;
let dateProvider;
let hashProvider;
describe('RefreshTokenUseCase', () => {
  beforeEach(() => {
    accountTokenRepositoryInMemory = new _AccountTokenRepositoryInMemory.default();
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    dateProvider = new _DayjsDateProvider.default();
    hashProvider = new _HashProviderInMemory.default();
    authenticateAccountUseCase = new _AuthenticateAccountUseCase.default(accountRepositoryInMemory, accountTokenRepositoryInMemory, dateProvider, hashProvider);
    refreshTokenUseCase = new _RefreshTokenUseCase.default(accountTokenRepositoryInMemory, dateProvider);
  });
  it('should be able to refresh token', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Full Name Test',
      email: 'email@test.com',
      phone: '5531900000000',
      password: 'password'
    });
    const auth = await authenticateAccountUseCase.execute({
      email: account.email,
      password: account.password
    });
    const refreshToken = await refreshTokenUseCase.execute(auth.refresh_token);
    expect(refreshToken.refresh_token !== auth.refresh_token).toBe(true);
    expect(refreshToken.token !== auth.token).toBe(false);
  });
  it('should not be able to refresh token with invalid token', async () => {
    await expect(refreshTokenUseCase.execute('invalid-token')).rejects.toEqual(new _AppError.default('Invalid token'));
  });
  it('should not be able to refresh token with nonexistent account token', async () => {
    const refresh_token = (0, _jsonwebtoken.sign)({
      email: 'another-email'
    }, _auth.default.secret_refresh_token, {
      subject: 'another-id',
      expiresIn: _auth.default.expires_in_refresh_token
    });
    await expect(refreshTokenUseCase.execute(refresh_token)).rejects.toEqual(new _AppError.default('Refresh Token does not exists'));
  });
});