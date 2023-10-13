"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

var _BCryptHashProvider = _interopRequireDefault(require("../../../shared/container/providers/HashProvider/implementations/BCryptHashProvider"));

var _PackageStatusEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageStatusEnum"));

var _PackageDocumentTypeEnum = _interopRequireDefault(require("../../../modules/packages/enums/PackageDocumentTypeEnum"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let hashProvider;
let account_id1;
let account_id2;
let account_id3;
let email1;
let email2;
let email3;
let password;
let number_existing;
const route = '/v1/packages';
const birthday_date = new Date(2001, 10, 5);
describe('CreatePackageController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    hashProvider = new _BCryptHashProvider.default();
    number_existing = '12345678901';
    account_id1 = (0, _uuid.v4)();
    account_id2 = (0, _uuid.v4)();
    account_id3 = (0, _uuid.v4)();
    email1 = 'accountemail1@test.com';
    email2 = 'accountemail2@test.com';
    email3 = 'accountemail3@test.com';
    password = 'Password1';
    const passwordHashed = await hashProvider.generateHash(password);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id1}', 'Full Name Test', '${email1}', '5531984258967','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id2}', 'Full Name Test Two', '${email2}', '5531984258968','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO ACCOUNTS(id, name, email, phone, password, created_at, updated_at )
         values('${account_id3}', 'Full Name Test Three', '${email3}', '5531984258969','${passwordHashed}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO SELLERS(account_id, status, created_at, updated_at )
         values('${account_id2}', '${_PackageStatusEnum.default.IN_ANALYSIS}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO SELLER_DOCUMENTS(package_id, number, type, birthday_date )
         values('${account_id2}', '${number_existing}', '${_PackageDocumentTypeEnum.default.CPF}', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to create a new package', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email: email1,
      password
    });
    const {
      token
    } = body;
    await factory.app.post(route).send({
      document: {
        number: '11932790624',
        type: 'CPF',
        birthday_date
      }
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(200).then(res => {
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('updated_at');
      expect(res.body.account_id).toBe(account_id1);
    });
  });
  it('should not be able to create two packages with same account', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email: email1,
      password
    });
    const {
      token
    } = body;
    await factory.app.post(route).send({
      document: {
        number: '11932790623',
        type: 'CPF',
        birthday_date
      }
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('This account is already a package');
    });
  });
  it('should not be able to create two packages with same number document', async () => {
    const {
      body
    } = await factory.app.post('/v1/sessions').send({
      email: email3,
      password
    });
    const {
      token
    } = body;
    await factory.app.post(route).send({
      document: {
        number: number_existing,
        type: 'CPF',
        birthday_date
      }
    }).set({
      Authorization: `Bearer ${token}`
    }).expect(400).then(res => {
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('This document is in use');
    });
  });
});