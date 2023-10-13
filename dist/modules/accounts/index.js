"use strict";

var _tsyringe = require("tsyringe");

var _AccountRepository = _interopRequireDefault(require("../accounts/infra/typeorm/repositories/AccountRepository"));

var _TermsRepository = _interopRequireDefault(require("./infra/typeorm/repositories/TermsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('AccountRepository', _AccountRepository.default);

_tsyringe.container.registerSingleton('TermsRepository', _TermsRepository.default);