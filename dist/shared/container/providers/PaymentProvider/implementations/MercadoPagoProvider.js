"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mercadopago = _interopRequireDefault(require("mercadopago"));

var _AppError = _interopRequireDefault(require("../../../../errors/AppError"));

var _payment = _interopRequireDefault(require("../../../../../config/payment"));

var _PaymentStatusEnum = require("../models/enums/PaymentStatusEnum");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MercadoPagoProvider {
  constructor() {
    this.mpIdentity = void 0;
    this.mpIdentity = _mercadopago.default;
    this.mpIdentity.configure({
      access_token: _payment.default.access_token
    });
  }

  async createPreference(preferenceData) {
    try {
      const dataPref = preferenceData;
      dataPref.statement_descriptor = 'CITAI';
      const data = await this.mpIdentity.preferences.create(dataPref);
      const {
        id,
        init_point
      } = data.body;
      return {
        preferenceId: id,
        link: init_point
      };
    } catch (error) {
      throw new _AppError.default('Internal Error', 500);
    }
  }

  async getPayment(paymentId) {
    try {
      const data = await this.mpIdentity.payment.get(paymentId);
      const body = data.body;
      const metadata = body.metadata;
      return {
        metadata,
        status: _PaymentStatusEnum.PaymentStatusEnum[body.status]
      };
    } catch (error) {
      throw new _AppError.default('Internal Error', 500);
    }
  }

}

var _default = MercadoPagoProvider;
exports.default = _default;