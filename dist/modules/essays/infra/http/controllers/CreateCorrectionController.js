"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateCorrectionUseCase = _interopRequireDefault(require("../../../useCases/CreateCorrectionUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateCorrectionController {
  async handle(req, res) {
    const {
      essayId
    } = req.body;

    const createCorrection = _tsyringe.container.resolve(_CreateCorrectionUseCase.default);

    const correction = await createCorrection.execute(essayId);
    return res.json(correction);
  }

}

var _default = CreateCorrectionController;
exports.default = _default;