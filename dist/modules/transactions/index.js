"use strict";

var _tsyringe = require("tsyringe");

var _TransactionRepository = _interopRequireDefault(require("../transactions/infra/typeorm/repositories/TransactionRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('TransactionRepository', _TransactionRepository.default);