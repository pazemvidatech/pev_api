"use strict";

var _tsyringe = require("tsyringe");

var _OpenAiProvider = _interopRequireDefault(require("./implementations/OpenAiProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('AiProvider', _OpenAiProvider.default);