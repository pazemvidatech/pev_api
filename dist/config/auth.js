"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _default = {
  secret_token: process.env.ACCOUNT_SECRET_TOKEN,
  secret_refresh_token: process.env.ACCOUNT_SECRET_REFRESH_TOKEN,
  expires_in_token: '15m',
  expires_in_refresh_token: '30d',
  expires_refresh_token_days: 30
};
exports.default = _default;