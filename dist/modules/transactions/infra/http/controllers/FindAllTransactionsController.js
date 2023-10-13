"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _FindAllTransactionsUseCase = _interopRequireDefault(require("../../../useCases/FindAllTransactionsUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FindAllTransactionsController {
  async handle(req, res) {
    const {
      sort,
      page,
      size
    } = req.query;
    const {
      id
    } = req.account;

    const findAllTransactions = _tsyringe.container.resolve(_FindAllTransactionsUseCase.default);

    const query = {
      where: {}
    };
    query.where.accountId = id;
    if (sort) query.sort = sort;
    if (page) query.page = Number(page);
    if (size) query.size = Number(size);
    const transactions = await findAllTransactions.execute(query);
    return res.json(transactions);
  }

}

var _default = FindAllTransactionsController;
exports.default = _default;