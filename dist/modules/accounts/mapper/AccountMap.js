"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccountMap = void 0;

var _classTransformer = require("class-transformer");

class AccountMap {
  static toDTO({
    id,
    email,
    name,
    credits,
    terms,
    subscription
  }) {
    const account = (0, _classTransformer.classToClass)({
      id,
      name,
      email,
      credits,
      subscription,
      terms,
      pendingTerms: false,
      pendingPrivacy: false
    });
    return account;
  }

}

exports.AccountMap = AccountMap;