"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let account_id2;
let email;
let password;
let not_existing_id;
const route = '/v1/administrators';
describe('CreateAdministratorController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    not_existing_id = (0, _uuid.v4)();
    const account_id1 = (0, _uuid.v4)();
    account_id2 = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id1}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id2}', 'Full Name Test Two', 'testemail@test.com', '5531984258968','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id1}', 'GOD', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to create a new administrator', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.post(route).send({
      account_id: account_id2,
      type: 'GOD'
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(200).then(res => {
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('updated_at');
      expect(res.body.type).toBe('GOD');
      expect(res.body.account_id).toBe(account_id2);
    });
  });
  it('should not be able to create administrator with a account that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.post(route).send({
      account_id: not_existing_id,
      type: 'GOD'
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Account does not exists');
    });
  });
});