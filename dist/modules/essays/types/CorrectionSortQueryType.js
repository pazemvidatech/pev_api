"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "OrderQueryType", {
  enumerable: true,
  get: function () {
    return _OrderQueryType.default;
  }
});
exports.arrayCorrectionSorts = void 0;

var _OrderQueryType = _interopRequireDefault(require("../../../shared/infra/types/OrderQueryType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const arrayCorrectionSorts = ['createdAt:ASC', 'createdAt:DESC'];
exports.arrayCorrectionSorts = arrayCorrectionSorts;