"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ConfirmDraftUseCase = _interopRequireDefault(require("../../../useCases/ConfirmDraftUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ConfirmDraftController {
  async handle(req, res) {
    const {
      essayId
    } = req.params;
    const {
      text,
      theme,
      isFour
    } = req.body;
    const {
      id
    } = req.account;

    const confirmDraft = _tsyringe.container.resolve(_ConfirmDraftUseCase.default);

    await confirmDraft.execute({
      accountId: id,
      text,
      theme,
      essayId,
      isFour
    });
    return res.status(201).send();
  }

}

var _default = ConfirmDraftController;
exports.default = _default;