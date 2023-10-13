"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let city_id1;
let city_id2;
let state_id;
let email;
let password;
const route = '/v1/cities';
describe('FindAllCitiesController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    city_id1 = (0, _uuid.v4)();
    city_id2 = (0, _uuid.v4)();
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
          values('${city_id1}', 'Viçosa', '${state_id}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CITIES(id, name, state_id, created_at, updated_at )
          values('${city_id2}', 'Ubá', '${state_id}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to find all cities', async () => {
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
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(2);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('created_at');
      expect(res.body[0]).toHaveProperty('updated_at');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('state_id');
    });
  });
});