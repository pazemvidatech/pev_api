"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = _interopRequireDefault(require("../../../../../shared/infra/typeorm"));

var _Terms = _interopRequireDefault(require("../entities/Terms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TermsRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = _typeorm.default.getRepository(_Terms.default);
  }

  async create(termData) {
    const term = this.ormRepository.create(termData);
    return await this.ormRepository.save(term);
  }

  async findByAccountIdAndVersion(data) {
    const term = await this.ormRepository.findOneBy(data);
    return term;
  }

  async remove(term) {
    return await this.ormRepository.remove(term);
  }

  async save(term) {
    return await this.ormRepository.save(term);
  }

}

var _default = TermsRepository;
exports.default = _default;