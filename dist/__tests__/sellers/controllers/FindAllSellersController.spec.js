"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

var _PackageStatusEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageStatusEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let account_id1 = (0, _uuid.v4)();
let account_id2 = (0, _uuid.v4)();
let account_id3 = (0, _uuid.v4)();
let account_id4 = (0, _uuid.v4)();
let account_id5 = (0, _uuid.v4)();
let email;
let password;
const route = '/v1/packages';
describe('FindAllPackagesController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    account_id1 = (0, _uuid.v4)();
    account_id2 = (0, _uuid.v4)();
    account_id3 = (0, _uuid.v4)();
    account_id4 = (0, _uuid.v4)();
    account_id5 = (0, _uuid.v4)();
    email = 'accountemail@test.com';
    password = 'password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id1}', 'Full Name Test', '${email}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id2}', 'Full Name Test Two', 'testemail1@test.com', '5531984258968','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id3}', 'Full Name Test Three', 'testemail2@test.com', '5531984258969','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id4}', 'Full Name Test Four', 'testemail3@test.com', '5531984258960','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id5}', 'Full Name Test Five', 'testemail4@test.com', '5531984258961','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ADMINISTRATORS(account_id, type, created_at, updated_at )
         values('${account_id1}', 'GOD', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO SELLERS(account_id, status, created_at, updated_at )
         values('${account_id2}', '${_PackageStatusEnum.default.IN_ANALYSIS}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO SELLERS(account_id, status, created_at, updated_at )
         values('${account_id3}', '${_PackageStatusEnum.default.IN_ANALYSIS}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO SELLERS(account_id, status, created_at, updated_at )
         values('${account_id4}', '${_PackageStatusEnum.default.ACTIVED}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO SELLERS(account_id, status, created_at, updated_at )
         values('${account_id5}', '${_PackageStatusEnum.default.DESACTIVED}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to find all packages with sort created_at ASC', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.get(route).query({
      sort: 'created_at:ASC',
      page: 0,
      size: 10
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(200).then(res => {
      const {
        data,
        total
      } = res.body;
      expect(data.length).toEqual(4);
      expect(total).toEqual(4);
      expect(data[0].account_id).toBe(account_id2);
      expect(data[1].account_id).toBe(account_id3);
      expect(data[2].account_id).toBe(account_id4);
      expect(data[3].account_id).toBe(account_id5);
    });
  });
  it('should be able to find all packages with sort created_at DESC', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.get(route).query({
      sort: 'created_at:DESC',
      page: 0,
      size: 10
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(200).then(res => {
      const {
        data,
        total
      } = res.body;
      expect(data.length).toEqual(4);
      expect(total).toEqual(4);
      expect(data[0].account_id).toBe(account_id5);
      expect(data[1].account_id).toBe(account_id4);
      expect(data[2].account_id).toBe(account_id3);
      expect(data[3].account_id).toBe(account_id2);
    });
  });
  it('should be able to find all packages with status and sort created_at ASC', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email,
      password
    });
    const {
      token
    } = body;
    await factory.app.get(route).query({
      sort: 'created_at:ASC',
      page: 0,
      size: 10,
      status: 'IN_ANALYSIS'
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(200).then(res => {
      const {
        data,
        total
      } = res.body;
      expect(data.length).toEqual(2);
      expect(total).toEqual(2);
      expect(data[0].account_id).toBe(account_id2);
      expect(data[1].account_id).toBe(account_id3);
    });
  });
});