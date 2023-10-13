"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let account_id;
const route = '/v1/accounts';
describe('UpdateAccountController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    account_id = (0, _uuid.v4)();
    const email = 'accountemail@test.com';
    const password = 'password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to update a account', async () => {
    await factory.app.put(route + `/${account_id}`).send({
      new_email: 'newemail@test.com',
      new_phone: '5531984258968',
      new_name: 'New Full Name Test'
    }).expect(204);
  });
  it('should not be able to update a account that not exists', async () => {
    await factory.app.put(route + `/${(0, _uuid.v4)()}`).send({
      new_email: 'newemail@test.com',
      new_phone: '5531984258968',
      new_name: 'New Full Name Test'
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Account does not exists');
    });
  });
});