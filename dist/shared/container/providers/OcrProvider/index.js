"use strict";

var _tsyringe = require("tsyringe");

var _PenToPrintProvider = _interopRequireDefault(require("./implementations/PenToPrintProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('OcrProvider', _PenToPrintProvider.default);