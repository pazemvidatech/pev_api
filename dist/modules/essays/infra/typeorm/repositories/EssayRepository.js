"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = _interopRequireDefault(require("../../../../../shared/infra/typeorm"));

var _Essay = _interopRequireDefault(require("../entities/Essay"));

var _Account = _interopRequireDefault(require("../../../../accounts/infra/typeorm/entities/Account"));

var _Transaction = _interopRequireDefault(require("../../../../transactions/infra/typeorm/entities/Transaction"));

var _AppError = _interopRequireDefault(require("../../../../../shared/errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EssayRepository {
  constructor() {
    this.ormRepository = void 0;
    this.connection = void 0;
    this.connection = _typeorm.default;
    this.ormRepository = _typeorm.default.getRepository(_Essay.default);
  }

  async create(essayData) {
    return await this.connection.transaction(async entityManager => {
      const account = await entityManager.findOneBy(_Account.default, {
        id: essayData.accountId
      });

      if (!account.subscription) {
        if (account.credits > 99) {
          const trans = new _Transaction.default();
          trans.accountId = essayData.accountId;
          trans.amount = 100;
          trans.description = 'Correção de redação';
          trans.type = 'debit';
          await entityManager.save(trans);
          account.credits = account.credits - 100;
          await entityManager.save(account);
        } else {
          throw new _AppError.default('Dont have sufficient credits', 403);
        }
      } else {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const essayToday = await entityManager.createQueryBuilder(_Essay.default, 'essay').where('essay.accountId = :accountId', {
          accountId: essayData.accountId
        }).andWhere('essay.createdAt >= :startOfDay', {
          startOfDay
        }).andWhere('essay.createdAt < :tomorrow', {
          tomorrow: new Date(today.getTime() + 86400000)
        }).getOne();

        if (essayToday) {
          if (account.credits > 99) {
            const trans = new _Transaction.default();
            trans.accountId = essayData.accountId;
            trans.amount = 100;
            trans.description = 'Correção de redação';
            trans.type = 'debit';
            await entityManager.save(trans);
            account.credits = account.credits - 100;
            await entityManager.save(account);
          } else {
            throw new _AppError.default('Essay sended today and you dont have sufficient credits', 409);
          }
        }
      }

      const essay = new _Essay.default();
      essay.accountId = essayData.accountId;
      essay.text = essayData.text;
      essay.theme = essayData.theme;
      if (essayData.status) essay.status = essayData.status;
      await entityManager.save(essay);
      return essay;
    });
  }

  async findById(id) {
    const essay = await this.ormRepository.findOne({
      where: {
        id
      }
    });
    return essay;
  }

  async findByIdRelations(id) {
    const essay = await this.ormRepository.findOne({
      where: {
        id
      },
      relations: {
        correction: true
      }
    });
    return essay;
  }

  async findByAccountIdAndToday(accountId) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const essay = await this.ormRepository.createQueryBuilder('essay').where('essay.accountId = :accountId', {
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

var _default = EssayRepository;
exports.default = _default;