"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Correction = _interopRequireDefault(require("../../infra/typeorm/entities/Correction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CorrectionRepositoryInMemory {
  constructor() {
    this.corrections = [];
  }

  async create(correctionData) {
    const {
      essayId,
      prompt,
      completion
    } = correctionData;
    const correction = new _Correction.default();
    Object.assign(correction, {
      essayId,
      prompt,
      completion,
      createdAt: new Date()
    });
    this.corrections.push(correction);
    return correction;
  }

  async findByEssayId(essayId) {
    const correction = this.corrections.find(correction => correction.essayId === essayId);
    return correction;
  }

  async findById(id) {
    const correction = this.corrections.find(correction => correction.id === id);
    return correction;
  }

  async findAll(query) {
    const orderBy = query.order.createdAt;
    const {
      take,
      skip
    } = query;
    const start = this.corrections;
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
    const corrections = start.slice(skip, skip + take);
    return {
      data: corrections,
      total: corrections.length
    };
  }

  async save(correction) {
    const findIndex = this.corrections.findIndex(findCorrection => findCorrection === correction);
    this.corrections[findIndex] = correction;
  }

  async remove(correction) {
    const findIndex = this.corrections.findIndex(correctionFinded => correctionFinded === correction);
    this.corrections.splice(findIndex, 1);
  }

}

var _default = CorrectionRepositoryInMemory;
exports.default = _default;