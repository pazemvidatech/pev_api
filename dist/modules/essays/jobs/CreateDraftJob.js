"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _OpenAiProvider = _interopRequireDefault(require("../../../shared/container/providers/AiProvider/implementations/OpenAiProvider"));

var _EssayRepository = _interopRequireDefault(require("../infra/typeorm/repositories/EssayRepository"));

var _EssayStatusEnum = _interopRequireDefault(require("../enums/EssayStatusEnum"));

var _FirebaseMessagingProvider = _interopRequireDefault(require("../../../shared/container/providers/NotificationProvider/implementations/FirebaseMessagingProvider"));

var _PenToPrintProvider = _interopRequireDefault(require("../../../shared/container/providers/OcrProvider/implementations/PenToPrintProvider"));

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateDraftJob = (_dec = (0, _tsyringe.injectable)(), _dec(_class = class CreateDraftJob {
  async execute({
    essayId,
    image,
    theme,
    token
  }) {
    const essayRepository = new _EssayRepository.default();
    const ocrProvider = new _PenToPrintProvider.default();
    const aiProvider = new _OpenAiProvider.default();
    const notificationProvider = new _FirebaseMessagingProvider.default();

    try {
      let text = await ocrProvider.convertManuscript(image);
      const correctText = await aiProvider.fixOrthography(text);
      if (correctText.length > 0) text = correctText;
      const essay = await essayRepository.findById(essayId);
      essay.status = _EssayStatusEnum.default.DRAFT;
      essay.text = text;
      await essayRepository.save(essay);

      if (token) {
        await notificationProvider.createNotification({
          token,
          title: 'Pronta para revisão',
          content: `A foto da redação do tema "${theme}" foi convertida e está pronta para revisão`
        });
      }

      return essay;
    } catch (error) {
      console.log(error);
    }
  }

}) || _class);
var _default = {
  key: 'CreateDraftJob',
  handle: new CreateDraftJob().execute.bind(new CreateDraftJob())
};
exports.default = _default;