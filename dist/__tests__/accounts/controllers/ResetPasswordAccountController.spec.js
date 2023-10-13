"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let token;
const route = '/v1/passwords/reset';
describe('ResetPasswordAccountController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    const accountId = (0, _uuid.v4)();
    const tokenId = (0, _uuid.v4)();
    token = (0, _uuid.v4)();
    const email = 'accountemail@test.com';
    const password = 'password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${accountId}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNT_TOKENS(id, account_id, refresh_token, expires_date, created_at )
         values('${tokenId}', '${accountId}', '${token}', NOW() + INTERVAL '1 HOUR', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to reset password', async () => {
    await factory.app.post(route + `?token=${token}`).send({
      password: 'password2'
    }).expect(204);
  });
});