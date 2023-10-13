"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ProfileAccountUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/ProfileAccountUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let accountRepositoryInMemory;
let profileAccountUseCase;
describe('ProfileAccountUseCase', () => {
  beforeEach(() => {
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    profileAccountUseCase = new _ProfileAccountUseCase.default(accountRepositoryInMemory);
  });
  it('should be able to show the profile of the account', async () => {
    const account = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    const accountProfile = await profileAccountUseCase.execute(account.id);
    expect(accountProfile).toHaveProperty('id');
    expect(accountProfile.name).toBe('Account Name Test');
    expect(accountProfile.email).toBe('accountemail@test.com');
    expect(accountProfile.phone).toBe('phone');
  });
  it('should not be able to profile of non existing account', async () => {
    await expect(profileAccountUseCase.execute('non-existing-id')).rejects.toEqual(new _AppError.default('Account does not exists'));
  });
});