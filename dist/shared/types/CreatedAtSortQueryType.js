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
exports.arrayCreatedAtSorts = void 0;

var _OrderQueryType = _interopRequireDefault(require("../infra/types/OrderQueryType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const arrayCreatedAtSorts = ['created_at:ASC', 'created_at:DESC'];
exports.arrayCreatedAtSorts = arrayCreatedAtSorts;