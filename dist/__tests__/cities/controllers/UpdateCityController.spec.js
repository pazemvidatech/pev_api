"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let city_id1;
let state_id1;
let state_id2;
let email;
let password;
let non_existing_id;
const route = '/v1/cities';
describe('UpdateCityController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    non_existing_id = (0, _uuid.v4)();
    city_id1 = (0, _uuid.v4)();
    const city_id2 = (0, _uuid.v4)();
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
    await factory.connection.query(`INSERT INTO CITIES(id, name, state_id, created_at, updated_at )
          values('${city_id1}', 'Viçosa', '${state_id1}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CITIES(id, name, state_id, created_at, updated_at )
          values('${city_id2}', 'Matipó', '${state_id1}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to update a specific city', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${city_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'São Paulo',
      new_state_id: state_id2
    }).expect(204).then(async () => {
      const city = await factory.connection.query(`SELECT * FROM cities WHERE id = '${city_id1}'`);
      expect(city[0].name).toBe('São Paulo');
      expect(city[0].state_id).toBe(state_id2);
    });
  });
  it('should not be able to update city that does not exists', async () => {
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
      new_name: 'São Paulo',
      new_state_id: state_id2
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This city does not exists');
      expect(res.body.status).toBe('error');
    });
  });
  it('should not be able to update city with state id that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${city_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Ubá',
      new_state_id: non_existing_id
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This state does not exists');
      expect(res.body.status).toBe('error');
    });
  });
  it('should not be able to update city with state id and name of another existing city', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${city_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Matipó',
      new_state_id: state_id1
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This city name already exists');
      expect(res.body.status).toBe('error');
    });
  });
});