"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyCreditAccount;

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function verifyCreditAccount({
  account,
  essayToday
}) {
  if (!account.subscription) {
    if (account.credits < 100) {
      throw new _AppError.default('Dont have sufficient credits', 403);
    }
  } else {
    if (essayToday) {
      if (account.credits < 100) {
        throw new _AppError.default('Essay sended today and you dont have sufficient credits', 409);
      }
    }
  }
}