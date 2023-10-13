"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _fileType = _interopRequireDefault(require("file-type"));

var _fs = _interopRequireDefault(require("fs"));

var _CreateDraftUseCase = _interopRequireDefault(require("../../../useCases/CreateDraftUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateDraftController {
  async handle(req, res) {
    const {
      theme
    } = req.body;
    const {
      id
    } = req.account;
    const image = req.file.filename;
    const type = await _fileType.default.fileTypeFromFile(req.file.path);

    if (!type || !['jpg', 'png', 'jpeg'].includes(type.ext)) {
      await _fs.default.promises.unlink(req.file.path);
      return res.status(422).send('Tipo de arquivo inválido');
    }

    const createDraft = _tsyringe.container.resolve(_CreateDraftUseCase.default);

    await createDraft.execute({
      accountId: id,
      image,
      theme
    });
    return res.status(204).send();
  }

}

var _default = CreateDraftController;
exports.default = _default;