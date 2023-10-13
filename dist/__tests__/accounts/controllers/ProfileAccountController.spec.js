"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let id;
let name;
let phone;
let email;
let password;
const route = '/v1/accounts/profile';
describe('ProfileAccountController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    id = (0, _uuid.v4)();
    name = 'Full Name Test';
    email = 'accountemail@test.com';
    phone = '5531984258967';
    password = 'password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${id}', '${name}', '${email}', '${phone}','${passwordHashed}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to show the profile of an account', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.get(route).set({
      Authorization: `Bearer ${token}`
    }).expect(200).then(res => {
      expect(res.body.name).toBe(name);
      expect(res.body.email).toBe(email);
      expect(res.body.phone).toBe(phone);
      expect(res.body.password).toBe(undefined);
      expect(res.body).toHaveProperty('avatar');
      expect(res.body).toHaveProperty('avatar_url');
    });
  });
  it('should not be able to show the profile of an account that does not exists', async () => {
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
    await factory.app.get(route).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Account does not exists');
    });
  });
});