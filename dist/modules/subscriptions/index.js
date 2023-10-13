"use strict";

var _tsyringe = require("tsyringe");

var _SubscriptionRepository = _interopRequireDefault(require("../subscriptions/infra/typeorm/repositories/SubscriptionRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('SubscriptionRepository', _SubscriptionRepository.default);