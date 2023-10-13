"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Essay = _interopRequireDefault(require("../../infra/typeorm/entities/Essay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EssayRepositoryInMemory {
  constructor() {
    this.essays = [];
  }

  async create(essayData) {
    const {
      accountId,
      text,
      theme
    } = essayData;
    const essay = new _Essay.default();
    Object.assign(essay, {
      accountId,
      text,
      theme,
      createdAt: new Date()
    });
    this.essays.push(essay);
    return essay;
  }

  async findById(id) {
    const essay = this.essays.find(essay => essay.id === id);
    return essay;
  }

  async findByAccountIdAndToday(accountId) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startTomorrow = new Date(today.getTime() + 86400000);
    const essay = this.essays.find(essay => essay.accountId === accountId && essay.createdAt >= startOfDay && essay.createdAt < startTomorrow);
    return essay;
  }

  async findAll(query) {
    const orderBy = query.order.createdAt;
    const {
      take,
      skip
    } = query;
    const start = this.essays;
    start.sort((a, b) => {
      const aCA = a.createdAt.getMilliseconds();
      const bCA = b.createdAt.getMilliseconds();

      switch (orderBy) {
        case 'ASC':
          return aCA - bCA;

        case 'DESC':
          return bCA - aCA;
      }
    });
    const essays = start.slice(skip, skip + take);
    return {
      data: essays,
      total: essays.length
    };
  }

  async findCount() {
    const numberEssays = this.essays.length;
    return numberEssays;
  }

  async save(essay) {
    const findIndex = this.essays.findIndex(findEssay => findEssay === essay);
    this.essays[findIndex] = essay;
  }

  async remove(essay) {
    const findIndex = this.essays.findIndex(essayFinded => essayFinded === essay);
    this.essays.splice(findIndex, 1);
  }

}

var _default = EssayRepositoryInMemory;
exports.default = _default;