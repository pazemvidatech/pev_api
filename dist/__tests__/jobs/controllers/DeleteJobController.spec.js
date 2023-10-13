"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let non_existing_id;
let category_id;
let subscription_id;
let email;
let password;
const route = '/v1/subscriptions';
describe('DeleteSubscriptionController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    non_existing_id = (0, _uuid.v4)();
    subscription_id = (0, _uuid.v4)();
    category_id = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const account_id = (0, _uuid.v4)();
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id}', 'GOD', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
         values('${category_id}', 'Educação', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO JOBS(id, name, category_id, created_at, updated_at )
         values('${subscription_id}', 'Professor de Matemática', '${category_id}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to delete a specific subscription', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.del(route + `/${subscription_id}`).set({
      Authorization: `Bearer ${token}`
    }).expect(204).then(async () => {
      const subscription = await factory.connection.query(`SELECT * FROM subscriptions WHERE id = '${subscription_id}'`);
      expect(subscription.length).toBe(0);
    });
  });
  it('should not be able to delete subscription that does not exists', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.del(route + `/${non_existing_id}`).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This subscription does not exists');
      expect(res.body.status).toBe('error');
    });
  });
});