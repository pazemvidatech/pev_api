"use strict";

var _tsyringe = require("tsyringe");

var _RemoteConfigProvider = _interopRequireDefault(require("./implementations/RemoteConfigProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('FeatureFlagProvider', _RemoteConfigProvider.default);