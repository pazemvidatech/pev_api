"use strict";

var _tsyringe = require("tsyringe");

var _DayjsDateProvider = _interopRequireDefault(require("./implementations/DayjsDateProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('DateProvider', _DayjsDateProvider.default);