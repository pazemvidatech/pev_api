"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let state_id1;
let state_id2;
let email;
let password;
let non_existing_id;
const route = '/v1/states';
describe('UpdateStateController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    non_existing_id = (0, _uuid.v4)();
    state_id1 = (0, _uuid.v4)();
    state_id2 = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const account_id = (0, _uuid.v4)();
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id}', 'GOD', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO STATES(id, name, uf, created_at, updated_at )
          values('${state_id1}', 'Minas Gerais', 'MG', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO STATES(id, name, uf, created_at, updated_at )
          values('${state_id2}', 'São Paulo', 'SP', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to update a specific state', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${state_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Espírito Santo',
      new_uf: 'ES'
    }).expect(204).then(async () => {
      const state = await factory.connection.query(`SELECT * FROM states WHERE id = '${state_id1}'`);
      expect(state[0].name).toBe('Espírito Santo');
      expect(state[0].uf).toBe('ES');
    });
  });
  it('should not be able to update state that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${non_existing_id}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Santa Catarina',
      new_uf: 'SC'
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This state does not exists');
      expect(res.body.status).toBe('error');
    });
  });
  it('should not be able to update state with name of another existing state', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${state_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'São Paulo',
      new_uf: 'SP'
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This state already exists');
      expect(res.body.status).toBe('error');
    });
  });
});