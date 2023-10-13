"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _FindAllEssaysUseCase = _interopRequireDefault(require("../../../useCases/FindAllEssaysUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FindAllEssaysController {
  async handle(req, res) {
    const {
      sort,
      page,
      size,
      status,
      accountId
    } = req.query;

    const findAllEssaysUseCase = _tsyringe.container.resolve(_FindAllEssaysUseCase.default);

    const query = {};
    query.relations = {
      correction: true
    };
    if (accountId || status) query.where = {};
    if (accountId) query.where.accountId = accountId;
    if (status) query.where.status = status;
    if (sort) query.sort = sort;
    if (page) query.page = Number(page);
    if (size) query.size = Number(size);
    const result = await findAllEssaysUseCase.execute(query);
    return res.json(result);
  }

}

var _default = FindAllEssaysController;
exports.default = _default;