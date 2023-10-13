"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let password;
let email;
let name;
let phone;
const route = '/v1/sessions';
describe('AuthenticateAccountController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    const id = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    name = 'Full Name Test';
    phone = '5531984258967';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${id}', '${name}', '${email}', '${phone}','${passwordHashed}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  describe('Return 200', () => {
    it('should be able to authenticate a account', async () => {
      await factory.app.post(route).send({
        email,
        password
      }).expect(200).then(res => {
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('refresh_token');
        expect(res.body.account).toHaveProperty('avatar_url');
        expect(res.body.account.name).toBe(name);
        expect(res.body.account.phone).toBe(phone);
        expect(res.body.account.email).toBe(email);
      });
    });
  });
  describe('Return error 401', () => {
    it('should not be able to authenticate with email that not exists', async () => {
      await factory.app.post(route).send({
        email: 'emailnotexists@pev.live',
        password: 'test-password'
      }).expect(401).then(res => {
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Credentials incorrect');
      });
    });
    it('should not be able authenticate with incorrect password', async () => {
      await factory.app.post(route).send({
        email,
        password: 'incorrect-password'
      }).expect(401).then(res => {
        expect(res.body.status).toBe('error');
        expect(res.body.message).toBe('Credentials incorrect');
      });
    });
  });
});