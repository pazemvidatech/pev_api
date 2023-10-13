"use strict";

var _tsyringe = require("tsyringe");

var _MercadoPagoProvider = _interopRequireDefault(require("./implementations/MercadoPagoProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('PaymentProvider', _MercadoPagoProvider.default);