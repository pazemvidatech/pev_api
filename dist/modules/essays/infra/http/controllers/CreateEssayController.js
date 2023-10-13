"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateEssayUseCase = _interopRequireDefault(require("../../../useCases/CreateEssayUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateEssayController {
  async handle(req, res) {
    const {
      text,
      theme,
      isFour
    } = req.body;
    const {
      id
    } = req.account;

    const createEssay = _tsyringe.container.resolve(_CreateEssayUseCase.default);

    const essay = await createEssay.execute({
      accountId: id,
      text,
      theme,
      isFour
    });
    return res.json(essay);
  }

}

var _default = CreateEssayController;
exports.default = _default;