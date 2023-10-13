"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateTransactionUseCase = _interopRequireDefault(require("../../../useCases/CreateTransactionUseCase"));

var _classTransformer = require("class-transformer");

var _Transaction = _interopRequireDefault(require("../../typeorm/entities/Transaction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateTransactionController {
  async handle(req, res) {
    const {
      description,
      amount,
      accountId,
      type,
      externalId
    } = req.body;

    const createTransaction = _tsyringe.container.resolve(_CreateTransactionUseCase.default);

    const transaction = await createTransaction.execute({
      description,
      accountId,
      externalId,
      amount,
      type
    });
    return res.json((0, _classTransformer.plainToClass)(_Transaction.default, transaction));
  }

}

var _default = CreateTransactionController;
exports.default = _default;