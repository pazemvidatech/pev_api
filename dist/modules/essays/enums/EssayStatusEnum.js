"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var EssayStatusEnum;

(function (EssayStatusEnum) {
  EssayStatusEnum["PENDING"] = "PENDING";
  EssayStatusEnum["COMPLETED"] = "COMPLETED";
  EssayStatusEnum["RECUSED"] = "RECUSED";
  EssayStatusEnum["CONVERTING"] = "CONVERTING";
  EssayStatusEnum["DRAFT"] = "DRAFT";
})(EssayStatusEnum || (EssayStatusEnum = {}));

var _default = EssayStatusEnum;
exports.default = _default;