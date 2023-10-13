"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = _interopRequireDefault(require("../../../../../shared/infra/typeorm"));

var _Account = _interopRequireDefault(require("../entities/Account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = _typeorm.default.getRepository(_Account.default);
  }

  async create(accountData) {
    const account = this.ormRepository.create(accountData);
    return await this.ormRepository.save(account);
  }

  async list() {
    const allAccounts = await this.ormRepository.find();
    return allAccounts;
  }

  async findByEmail(email) {
    const account = await this.ormRepository.findOne({
      where: {
        email
      }
    });
    return account;
  }

  async findById(id) {
    const account = await this.ormRepository.findOneBy({
      id
    });
    return account;
  }

  async remove(account) {
    return await this.ormRepository.remove(account);
  }

  async save(account) {
    return await this.ormRepository.save(account);
  }

}

var _default = AccountRepository;
exports.default = _default;