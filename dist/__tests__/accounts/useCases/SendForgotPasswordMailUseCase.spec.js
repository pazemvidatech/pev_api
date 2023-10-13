"use strict";

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _AccountTokenRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountTokenRepositoryInMemory"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _SendForgotPasswordMailUseCase = _interopRequireDefault(require("../../../modules/accounts/useCases/SendForgotPasswordMailUseCase"));

var _DayjsDateProvider = _interopRequireDefault(require("../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider"));

var _MailProviderInMemory = require("../../../shared/container/providers/MailProvider/InMemory/MailProviderInMemory");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let accountRepositoryInMemory;
let accountTokenRepositoryInMemory;
let sendForgotPasswordMailUseCase;
let dateProvider;
let mailProvider;
describe('SendForgotPasswordMailUseCase', () => {
  beforeEach(() => {
    accountTokenRepositoryInMemory = new _AccountTokenRepositoryInMemory.default();
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    dateProvider = new _DayjsDateProvider.default();
    mailProvider = new _MailProviderInMemory.MailProviderInMemory();
    sendForgotPasswordMailUseCase = new _SendForgotPasswordMailUseCase.default(accountRepositoryInMemory, accountTokenRepositoryInMemory, dateProvider, mailProvider);
  });
  it('should be able to reset password account', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');
    const account = await accountRepositoryInMemory.create({
      name: 'Full Name Test',
      email: 'email@test.com',
      phone: '5531900000000',
      password: 'password'
    });
    await sendForgotPasswordMailUseCase.execute(account.email);
    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to recover a non-existing account password', async () => {
    await expect(sendForgotPasswordMailUseCase.execute('non-existing-email')).rejects.toEqual(new _AppError.default('Account does not exists'));
  });
});