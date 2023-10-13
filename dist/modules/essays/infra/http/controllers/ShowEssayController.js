"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ShowEssayUseCase = _interopRequireDefault(require("../../../useCases/ShowEssayUseCase"));

var _EssayMap = require("../../../mapper/EssayMap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ShowEssayController {
  async handle(req, res) {
    const {
      essayId
    } = req.params;
    const {
      id
    } = req.account;

    const showEssayUseCase = _tsyringe.container.resolve(_ShowEssayUseCase.default);

    const essay = await showEssayUseCase.execute(essayId, id);

    const essayMapped = _EssayMap.EssayMap.toDTO(essay);

    return res.json(essayMapped);
  }

}

var _default = ShowEssayController;
exports.default = _default;