"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Transaction = _interopRequireDefault(require("../modules/transactions/infra/typeorm/entities/Transaction"));

var _Account = _interopRequireDefault(require("../modules/accounts/infra/typeorm/entities/Account"));

var _Essay = _interopRequireDefault(require("../modules/essays/infra/typeorm/entities/Essay"));

var _Correction = _interopRequireDefault(require("../modules/essays/infra/typeorm/entities/Correction"));

var _Terms = _interopRequireDefault(require("../modules/accounts/infra/typeorm/entities/Terms"));

var _Subscription = _interopRequireDefault(require("../modules/subscriptions/infra/typeorm/entities/Subscription"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = {
  type: 'postgres',
  synchronize: false,
  ssl: true,
  logging: false,
  url: encodeURI(process.env.DATABASE_URL),
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  subscribers: [],
  entities: [_Transaction.default, _Account.default, _Essay.default, _Correction.default, _Terms.default, _Subscription.default],
  migrations: ['dist/shared/infra/typeorm/migrations/*.js'],
  migrationsRun: true,
  migrationsTableName: 'history'
};
var _default = config;
exports.default = _default;