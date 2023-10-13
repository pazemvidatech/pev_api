"use strict";

var _tsyringe = require("tsyringe");

var _CognitoProvider = _interopRequireDefault(require("./implementations/CognitoProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('AuthenticationProvider', _CognitoProvider.default);