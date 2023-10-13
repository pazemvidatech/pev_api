"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _awsSdk = require("aws-sdk");

var _aws = _interopRequireDefault(require("../../../../../config/aws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SQSProvider {
  constructor() {
    this.sqsIdentity = void 0;
    this.sqsIdentity = new _awsSdk.SQS({
      region: _aws.default.region,
      credentials: _aws.default.credentials
    });
  }

  async createCorrectionQueue(data) {
    const params = {
      MessageBody: JSON.stringify(data),
      QueueUrl: _aws.default.queueUrl
    };
    this.sqsIdentity.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Erro ao enviar mensagem para fila: ', err);
      } else {
        console.log('Mensagem enviada para fila com sucesso: ', data.MessageId);
      }
    });
  }

}

var _default = SQSProvider;
exports.default = _default;