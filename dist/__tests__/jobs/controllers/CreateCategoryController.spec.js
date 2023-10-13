"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let accountId;
let email;
let password;
const route = '/v1/categories';
describe('CreateCategoryController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    accountId = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const category_id = (0, _uuid.v4)();
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${accountId}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${accountId}', 'GOD', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
         values('${category_id}', 'Lazer', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to create a new category', async () => {
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
      name: 'Educação'
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(200).then(res => {
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('updated_at');
      expect(res.body.name).toBe('Educação');
    });
  });
  it('should not be able to create a new category with same name', async () => {
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
      name: 'Lazer'
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This category already exists');
      expect(res.body.status).toBe('error');
    });
  });
});