"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Account = _interopRequireDefault(require("../../infra/typeorm/entities/Account"));

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountRepositoryInMemory {
  constructor() {
    this.accounts = void 0;
    this.accounts = [];
  }

  async create(accountData) {
    const {
      name,
      email
    } = accountData;
    const account = new _Account.default();
    Object.assign(account, {
      id: (0, _uuid.v4)(),
      name,
      email
    });
    this.accounts.push(account);
    return account;
  }

  async list() {
    const allAccounts = this.accounts;
    return allAccounts;
  }

  async findByEmail(email) {
    const account = this.accounts.find(account => account.email === email);
    return account;
  }

  async findById(id) {
    const account = this.accounts.find(account => account.id === id);
    return account;
  }

  async remove(account) {
    const findIndex = this.accounts.findIndex(accountFinded => accountFinded === account);
    const accountDeleted = this.accounts.splice(findIndex, 1);
    return accountDeleted[0];
  }

  async save(account) {
    const findIndex = this.accounts.findIndex(accountFinded => accountFinded === account);
    this.accounts[findIndex] = account;
    return account;
  }

}

var _default = AccountRepositoryInMemory;
exports.default = _default;