"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _default = {
  access_token: process.env.MERCADO_PAGO_TOKEN
};
exports.default = _default;