"use strict";

require("dotenv/config");

var _Queue = _interopRequireDefault(require("../../queues/Queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Queue.default.process();