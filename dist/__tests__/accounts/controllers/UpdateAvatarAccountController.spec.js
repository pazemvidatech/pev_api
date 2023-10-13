"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let email;
let password;
let id;
const route = '/v1/accounts/avatar';
describe('UpdateAvatarAccountController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    id = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO accounts(id, name, email, phone, password, created_at, updated_at )
         values('${id}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to update accounts avatar', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.patch(route).attach('avatar', 'src/__tests__/tmp/test.jpg').set({
      Authorization: `Bearer ${token}`
    }).expect(204);
  });
  it('should not be able to update the avatar of an account that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.connection.query(`DELETE FROM accounts WHERE id = '${id}'`);
    await factory.app.patch(route).attach('avatar', 'src/__tests__/tmp/test.jpg').set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Account does not exists');
    });
  });
});