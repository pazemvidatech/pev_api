"use strict";

var _AdministratorRepositoryInMemory = _interopRequireDefault(require("../../../modules/administrators/repositories/inMemory/AdministratorRepositoryInMemory"));

var _AccountRepositoryInMemory = _interopRequireDefault(require("../../../modules/accounts/repositories/inMemory/AccountRepositoryInMemory"));

var _FindAllAdministratorsUseCase = _interopRequireDefault(require("../../../modules/administrators/useCases/FindAllAdministratorsUseCase"));

var _TypeAdministratorType = _interopRequireDefault(require("../../../modules/administrators/types/TypeAdministratorType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let administratorRepositoryInMemory;
let accountRepositoryInMemory;
let findAllAdministratorsUseCase;
describe('FindAllAdministratorsUseCase', () => {
  beforeEach(() => {
    administratorRepositoryInMemory = new _AdministratorRepositoryInMemory.default();
    accountRepositoryInMemory = new _AccountRepositoryInMemory.default();
    findAllAdministratorsUseCase = new _FindAllAdministratorsUseCase.default(administratorRepositoryInMemory);
  });
  it('should be able to list the administrators', async () => {
    const account1 = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    const account2 = await accountRepositoryInMemory.create({
      name: 'Account Name Test',
      email: 'accountemail@test.com',
      password: 'password',
      phone: 'phone'
    });
    const administrator1 = await administratorRepositoryInMemory.create({
      account_id: account1.id,
      type: _TypeAdministratorType.default.GOD
    });
    const administrator2 = await administratorRepositoryInMemory.create({
      account_id: account2.id,
      type: _TypeAdministratorType.default.GOD
    });
    const administrators = await findAllAdministratorsUseCase.execute();
    expect(administrators).toEqual([administrator1, administrator2]);
  });
});