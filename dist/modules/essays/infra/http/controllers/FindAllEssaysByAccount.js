"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _FindAllEssaysUseCase = _interopRequireDefault(require("../../../useCases/FindAllEssaysUseCase"));

var _classTransformer = require("class-transformer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FindAllEssaysController {
  async handle(req, res) {
    const {
      sort,
      page,
      size,
      status
    } = req.query;
    const {
      id
    } = req.account;

    const findAllEssaysUseCase = _tsyringe.container.resolve(_FindAllEssaysUseCase.default);

    const query = {
      where: {}
    };
    query.where.accountId = id;
    if (status) query.where.status = status;
    if (sort) query.sort = sort;
    if (page) query.page = Number(page);
    if (size) query.size = Number(size);
    const result = await findAllEssaysUseCase.execute(query);
    const data = (0, _classTransformer.classToPlain)(result.data);
    delete result.data;
    return res.json({
      data,
      ...result
    });
  }

}

var _default = FindAllEssaysController;
exports.default = _default;