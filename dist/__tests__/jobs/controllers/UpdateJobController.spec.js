"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let subscription_id1;
let category_id1;
let category_id2;
let email;
let password;
let non_existing_id;
const route = '/v1/subscriptions';
describe('UpdateSubscriptionController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    non_existing_id = (0, _uuid.v4)();
    subscription_id1 = (0, _uuid.v4)();
    const subscription_id2 = (0, _uuid.v4)();
    category_id1 = (0, _uuid.v4)();
    category_id2 = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const account_id = (0, _uuid.v4)();
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id}', 'GOD', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
         values('${category_id1}', 'Educação', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
         values('${category_id2}', 'Lazer', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO JOBS(id, name, category_id, created_at, updated_at )
         values('${subscription_id1}', 'Professor de Matemática', '${category_id1}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO JOBS(id, name, category_id, created_at, updated_at )
         values('${subscription_id2}', 'Vendedor de Ingressos', '${category_id2}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to update a specific subscription', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${subscription_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'DJ',
      new_category_id: category_id2
    }).expect(204).then(async () => {
      const subscription = await factory.connection.query(`SELECT * FROM subscriptions WHERE id = '${subscription_id1}'`);
      expect(subscription[0].name).toBe('DJ');
      expect(subscription[0].category_id).toBe(category_id2);
    });
  });
  it('should not be able to update subscription that does not exists', async () => {
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
      new_name: 'DJ',
      new_category_id: category_id2
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This subscription does not exists');
      expect(res.body.status).toBe('error');
    });
  });
  it('should not be able to update subscription with category id that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${subscription_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Garçom',
      new_category_id: non_existing_id
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This category does not exists');
      expect(res.body.status).toBe('error');
    });
  });
  it('should not be able to update subscription with category id and name of another existing subscription', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${subscription_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Vendedor de Ingressos',
      new_category_id: category_id2
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This subscription already exists');
      expect(res.body.status).toBe('error');
    });
  });
});