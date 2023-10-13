"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = _interopRequireDefault(require("../../../../../shared/infra/typeorm"));

var _Correction = _interopRequireDefault(require("../entities/Correction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CorrectionRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = _typeorm.default.getRepository(_Correction.default);
  }

  async create(essayData) {
    const essayCreate = this.ormRepository.create(essayData);
    return await this.ormRepository.save(essayCreate);
  }

  async findById(id) {
    const essay = await this.ormRepository.findOne({
      where: {
        id
      }
    });
    return essay;
  }

  async findByEssayId(essayId) {
    const essay = await this.ormRepository.findOne({
      where: {
        essayId
      }
    });
    return essay;
  }

  async findByAccountIdAndTodayDate(accountId) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const essay = await this.ormRepository.createQueryBuilder('essay').where('essay.accountID = :accountID', {
      accountId
    }).andWhere('essay.createdAt >= :startOfDay', {
      startOfDay
    }).andWhere('essay.createdAt < :tomorrow', {
      tomorrow: new Date(today.getTime() + 86400000)
    }).getOne();
    return essay;
  }

  async findAll(query) {
    const result = await this.ormRepository.findAndCount(query);
    return {
      data: result[0],
      total: result[1]
    };
  }

  async save(essay) {
    await this.ormRepository.save(essay);
  }

  async remove(essay) {
    await this.ormRepository.remove(essay);
  }

}

var _default = CorrectionRepository;
exports.default = _default;