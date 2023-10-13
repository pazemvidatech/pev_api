"use strict";

var _tsyringe = require("tsyringe");

var _SQSProvider = _interopRequireDefault(require("./implementations/SQSProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('QueueProvider', _SQSProvider.default);