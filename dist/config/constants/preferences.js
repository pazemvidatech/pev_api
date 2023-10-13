"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dayjs = _interopRequireDefault(require("dayjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MININUM_BIRTHDATE_SELLER = (0, _dayjs.default)().subtract(18, 'year').toDate();
var _default = {
  min_birth_package: MININUM_BIRTHDATE_SELLER
};
exports.default = _default;