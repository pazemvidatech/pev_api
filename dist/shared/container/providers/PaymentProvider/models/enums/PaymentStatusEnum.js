"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaymentStatusEnum = void 0;
let PaymentStatusEnum;
exports.PaymentStatusEnum = PaymentStatusEnum;

(function (PaymentStatusEnum) {
  PaymentStatusEnum["pending"] = "pending";
  PaymentStatusEnum["approved"] = "approved";
  PaymentStatusEnum["authorized"] = "authorized";
  PaymentStatusEnum["in_process"] = "in_process";
  PaymentStatusEnum["in_mediation"] = "in_mediation";
  PaymentStatusEnum["rejected"] = "rejected";
  PaymentStatusEnum["cancelled"] = "cancelled";
  PaymentStatusEnum["refunded"] = "refunded";
  PaymentStatusEnum["charged_back"] = "charged_back";
})(PaymentStatusEnum || (exports.PaymentStatusEnum = PaymentStatusEnum = {}));