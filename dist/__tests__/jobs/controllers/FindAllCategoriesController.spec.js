"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let category_id1;
let category_id2;
const route = '/v1/categories';
describe('FindAllCategoriesController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    category_id1 = (0, _uuid.v4)();
    category_id2 = (0, _uuid.v4)();
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
         values('${category_id1}', 'Educação', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
         values('${category_id2}', 'Lazer', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to find all categories', async () => {
    await factory.app.get(route).expect(200).then(res => {
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(2);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('created_at');
      expect(res.body[0]).toHaveProperty('updated_at');
      expect(res.body[0]).toHaveProperty('name');
    });
  });
});