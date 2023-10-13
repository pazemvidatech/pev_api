"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _UpdateStatusEssayUseCase = _interopRequireDefault(require("../../../useCases/UpdateStatusEssayUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpdateStatusEssayController {
  async handle(req, res) {
    const {
      essayId
    } = req.params;
    const {
      newStatus
    } = req.body;

    const updateStatusEssayUseCase = _tsyringe.container.resolve(_UpdateStatusEssayUseCase.default);

    await updateStatusEssayUseCase.execute({
      newStatus,
      id: essayId
    });
    return res.status(204).send();
  }

}

var _default = UpdateStatusEssayController;
exports.default = _default;