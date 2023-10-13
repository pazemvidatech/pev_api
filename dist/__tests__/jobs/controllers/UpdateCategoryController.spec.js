"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let category_id1;
let category_id2;
let email;
let password;
let non_existing_id;
const route = '/v1/categories';
describe('UpdateCategoryController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    non_existing_id = (0, _uuid.v4)();
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
         values('${category_id1}', 'Educa', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
         values('${category_id2}', 'Lazer', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to update a specific category', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${category_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Educação'
    }).expect(204).then(async () => {
      const category = await factory.connection.query(`SELECT * FROM categories WHERE id = '${category_id1}'`);
      expect(category[0].name).toBe('Educação');
    });
  });
  it('should not be able to update category that does not exists', async () => {
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
      new_name: 'Beleza'
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This category does not exists');
      expect(res.body.status).toBe('error');
    });
  });
  it('should not be able to update category with name of another existing category', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.put(route + `/${category_id1}`).set({
      Authorization: `Bearer ${token}`
    }).send({
      new_name: 'Lazer'
    }).expect(400).then(res => {
      expect(res.body.message).toBe('This category already exists');
      expect(res.body.status).toBe('error');
    });
  });
});