"use strict";

var _tsyringe = require("tsyringe");

var _PurchaseProvider = _interopRequireDefault(require("./implementations/PurchaseProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('PurchaseProvider', _PurchaseProvider.default);