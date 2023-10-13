"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CorrectionRepository = _interopRequireDefault(require("../infra/typeorm/repositories/CorrectionRepository"));

var _tsyringe = require("tsyringe");

var _OpenAiProvider = _interopRequireDefault(require("../../../shared/container/providers/AiProvider/implementations/OpenAiProvider"));

var _EssayRepository = _interopRequireDefault(require("../infra/typeorm/repositories/EssayRepository"));

var _EssayStatusEnum = _interopRequireDefault(require("../enums/EssayStatusEnum"));

var _FirebaseMessagingProvider = _interopRequireDefault(require("../../../shared/container/providers/NotificationProvider/implementations/FirebaseMessagingProvider"));

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateCorrectionJob = (_dec = (0, _tsyringe.injectable)(), _dec(_class = class CreateCorrectionJob {
  async createCorrection(prompt, completion, essayId) {
    const correctionRepository = new _CorrectionRepository.default();
    const checkCorrectionExists = await correctionRepository.findByEssayId(essayId);
    let result;

    if (!checkCorrectionExists) {
      result = await correctionRepository.create({
        prompt,
        completion,
        essayId
      });
    } else {
      checkCorrectionExists.prompt = prompt;
      checkCorrectionExists.completion = completion;
      await correctionRepository.save(checkCorrectionExists);
      result = checkCorrectionExists;
    }

    return result;
  }

  async execute({
    essayId,
    text,
    theme,
    token,
    automaticFlag,
    isFour
  }) {
    const essayRepository = new _EssayRepository.default();
    const aiProvider = new _OpenAiProvider.default();
    const notificationProvider = new _FirebaseMessagingProvider.default();
    const {
      prompt,
      completion
    } = await aiProvider.correctionEssay({
      text,
      theme,
      isFour
    });
    const obj = JSON.parse(completion);

    if (automaticFlag === true) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const correction = obj;
        const result = await this.createCorrection(prompt, completion, essayId);
        const essay = await essayRepository.findById(essayId);
        essay.status = _EssayStatusEnum.default.COMPLETED;
        await essayRepository.save(essay);

        if (token) {
          await notificationProvider.createNotification({
            token,
            title: 'Redação corrigida!',
            content: `A redação sobre o tema "${theme}" foi corrigida`
          });
        }

        return result;
      } catch (error) {
        console.log(error);
        await this.execute({
          essayId,
          text,
          theme,
          token,
          automaticFlag,
          isFour
        });
      }
    } else {
      const result = await this.createCorrection(prompt, completion, essayId);
      return result;
    }
  }

}) || _class);
var _default = {
  key: 'CreateCorrectionJob',
  handle: new CreateCorrectionJob().execute.bind(new CreateCorrectionJob())
};
exports.default = _default;