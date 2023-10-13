"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _DeleteTransactionUseCase = _interopRequireDefault(require("../../../useCases/DeleteTransactionUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DeleteTransactionController {
  async handle(req, res) {
    const {
      transactionId
    } = req.params;

    const deleteTransaction = _tsyringe.container.resolve(_DeleteTransactionUseCase.default);

    await deleteTransaction.execute(transactionId);
    return res.status(204).send();
  }

}

var _default = DeleteTransactionController;
exports.default = _default;