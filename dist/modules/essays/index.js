"use strict";

var _tsyringe = require("tsyringe");

var _EssayRepository = _interopRequireDefault(require("../essays/infra/typeorm/repositories/EssayRepository"));

var _CorrectionRepository = _interopRequireDefault(require("../essays/infra/typeorm/repositories/CorrectionRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('EssayRepository', _EssayRepository.default);

_tsyringe.container.registerSingleton('CorrectionRepository', _CorrectionRepository.default);