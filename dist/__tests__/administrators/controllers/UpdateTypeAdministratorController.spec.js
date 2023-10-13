"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let account_id2;
let not_existing_id;
let email;
let password;
const route = '/v1/administrators';
describe('UpdateTypeAdministratorController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    email = 'accountemail@test.com';
    password = 'password1';
    const account_id1 = (0, _uuid.v4)();
    account_id2 = (0, _uuid.v4)();
    not_existing_id = (0, _uuid.v4)();
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id1}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id2}', 'Full Name Test Two', 'testemail@test.com', '5531984258968','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id1}', 'GOD', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id2}', 'HERO', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to update type of a specific administrator', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.patch(route + `/${account_id2}` + '/type').send({
      new_type: 'GOD'
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(204).then(async () => {
      const administrator = await factory.connection.query(`SELECT * FROM administrators WHERE account_id = '${account_id2}'`);
      expect(administrator[0].type).toBe('GOD');
    });
  });
  it('should not be able to update type of a administrator that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.patch(route + `/${not_existing_id}` + '/type').send({
      new_type: 'GOD'
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.message).toBe('Administrator does not exists');
      expect(res.body.status).toBe('error');
    });
  });
});