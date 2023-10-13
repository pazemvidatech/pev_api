"use strict";

var _factory = _interopRequireDefault(require("../../factory"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let factory;
let subscription_id1;
let subscription_id2;
let category_id;
const route = '/v1/subscriptions';
describe('FindAllsubscriptionsController', () => {
  beforeAll(async () => {
    factory = new _factory.default();
    await factory.init();
    subscription_id1 = (0, _uuid.v4)();
    subscription_id2 = (0, _uuid.v4)();
    category_id = (0, _uuid.v4)();
    await factory.connection.query(`INSERT INTO CATEGORIES(id, name, created_at, updated_at )
          values('${category_id}', 'Educação', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO JOBS(id, name, category_id, created_at, updated_at )
         values('${subscription_id1}', 'Professor de Matemática', '${category_id}', 'now()', 'now()')`);
    await factory.connection.query(`INSERT INTO JOBS(id, name, category_id, created_at, updated_at )
         values('${subscription_id2}', 'Professor de Português', '${category_id}', 'now()', 'now()')`);
  });
  afterAll(async () => {
    await factory.close();
  });
  it('should be able to find all cities', async () => {
    await factory.app.get(route).expect(200).then(res => {
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toEqual(2);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('created_at');
      expect(res.body[0]).toHaveProperty('updated_at');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('category_id');
    });
  });
});