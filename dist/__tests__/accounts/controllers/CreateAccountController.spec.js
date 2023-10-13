"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let name;
let email;
let phone;
let password;
const route = '/v1/accounts';
describe('CreateAccountController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    name = 'Test Full Name';
    email = 'emailtest@test.com';
    phone = '5531900000000';
    password = 'passwordtest1';
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to create a new account', async () => {
    await factory.app.post(route).send({
      name,
      email,
      phone,
      password
    }).expect(200).then(res => {
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('updated_at');
      expect(res.body.name).toBe(name);
      expect(res.body.email).toBe(email);
      expect(res.body.phone).toBe(phone);
      expect(res.body.password).toBe(undefined);
    });
  });
  it('should not be able to create a new account with same email', async () => {
    await factory.app.post(route).send({
      name,
      email,
      phone: '5531900000001',
      password
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Email already in use');
    });
  });
  it('should not be able to create a new account with same phone', async () => {
    await factory.app.post(route).send({
      name,
      email: 'emailtest2@test.com',
      phone,
      password
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Phone already in use');
    });
  });
});