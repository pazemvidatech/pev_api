"use strict";

var _tsyringe = require("tsyringe");

var _FirebaseMessagingProvider = _interopRequireDefault(require("./implementations/FirebaseMessagingProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('NotificationProvider', _FirebaseMessagingProvider.default);