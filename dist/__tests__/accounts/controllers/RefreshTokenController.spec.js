"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _jsonwebtoken = require("jsonwebtoken");

var _auth = _interopRequireDefault(require("../../../config/auth"));

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let email;
let password;
const route = '/v1/refresh-token';
describe('RefreshTokenController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    const id = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${id}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to refresh token', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      refresh_token
    } = body;
    await factory.app.post(route + `?token=${refresh_token}`).expect(200).then(res => {
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refresh_token');
    });
  });
  it('should not be able to refresh token with invalid token', async () => {
    await factory.app.post(route).query({
      token: `invalidtoken`
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Invalid token');
    });
  });
  it('should not be able to refresh token with nonexistent account token', async () => {
    const refresh_token = (0, _jsonwebtoken.sign)({
      email: 'another-email'
    }, _auth.default.secret_refresh_token, {
      subject: (0, _uuid.v4)(),
      expiresIn: _auth.default.expires_in_refresh_token
    });
    await factory.app.post(route).query({
      token: refresh_token
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('Refresh Token does not exists');
    });
  });
});