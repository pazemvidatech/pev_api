"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _appStoreServerApi = require("app-store-server-api");

class PurchaseProvider {
  async verifyAndroid({
    value
  }) {
    const payload = await (0, _appStoreServerApi.decodeNotificationPayload)(value);
    const transactionInfo = await (0, _appStoreServerApi.decodeTransaction)(payload.data.signedTransactionInfo);
    return {
      token: transactionInfo.transactionId,
      product_id: transactionInfo.productId,
      status: payload.data.status.toString()
    };
  }

  async verifyApple({
    value
  }) {
    const payload = await (0, _appStoreServerApi.decodeNotificationPayload)(value);
    const transactionInfo = await (0, _appStoreServerApi.decodeTransaction)(payload.data.signedTransactionInfo);
    return {
      token: transactionInfo.transactionId,
      product_id: transactionInfo.productId,
      status: payload.data.status.toString()
    };
  }

}

var _default = PurchaseProvider;
exports.default = _default;