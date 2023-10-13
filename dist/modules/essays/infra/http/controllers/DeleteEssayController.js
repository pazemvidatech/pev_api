"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _DeleteEssayUseCase = _interopRequireDefault(require("../../../useCases/DeleteEssayUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DeleteEssayController {
  async handle(req, res) {
    const {
      essayId
    } = req.params;

    const deleteEssayUseCase = _tsyringe.container.resolve(_DeleteEssayUseCase.default);

    await deleteEssayUseCase.execute(essayId);
    return res.status(204).send();
  }

}

var _default = DeleteEssayController;
exports.default = _default;