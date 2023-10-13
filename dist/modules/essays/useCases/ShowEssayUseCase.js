"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _IEssayRepository = _interopRequireDefault(require("../repositories/IEssayRepository"));

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ShowEssayUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('EssayRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _IEssayRepository.default === "undefined" ? Object : _IEssayRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class ShowEssayUseCase {
  constructor(essayRepository) {
    this.essayRepository = essayRepository;
  }

  async execute(id, accountId) {
    const essay = await this.essayRepository.findByIdRelations(id);
    if (!essay) throw new _AppError.default('Essay not found', 404);
    if (essay.accountId !== accountId) throw new _AppError.default('Essay not found', 404);
    return essay;
  }

}) || _class) || _class) || _class) || _class);
var _default = ShowEssayUseCase;
exports.default = _default;