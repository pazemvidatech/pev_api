"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let city_id;
let state_id;
let email;
let password;
const route = '/v1/cities';
describe('DeleteCityController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    city_id = (0, _uuid.v4)();
    state_id = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const account_id = (0, _uuid.v4)();
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id}', 'GOD', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO STATES(id, name, uf, created_at, updated_at )
          values('${state_id}', 'Minas Gerais', 'MG', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CITIES(id, name, state_id, created_at, updated_at )
          values('${city_id}', 'Viçosa', '${state_id}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to delete a specific city', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.del(route + `/${city_id}`).set({
      Authorization: `Bearer ${token}`
    }).expect(204);
  });
  it('should not be able to delete city that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.del(route + `/${city_id}`).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This city does not exists');
      expect(res.body.status).toBe('error');
    });
  });
});