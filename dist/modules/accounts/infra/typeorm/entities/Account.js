"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.accountTableName = void 0;

var _Essay = _interopRequireDefault(require("../../../../essays/infra/typeorm/entities/Essay"));

var _Transaction = _interopRequireDefault(require("../../../../transactions/infra/typeorm/entities/Transaction"));

var _Subscription = _interopRequireDefault(require("../../../../subscriptions/infra/typeorm/entities/Subscription"));

var _typeorm = require("typeorm");

var _uuid = require("uuid");

var _Terms = _interopRequireDefault(require("./Terms"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

const accountTableName = 'accounts';
exports.accountTableName = accountTableName;
let Account = (_dec = (0, _typeorm.Entity)(accountTableName), _dec2 = Reflect.metadata("design:type", Function), _dec3 = Reflect.metadata("design:paramtypes", []), _dec4 = (0, _typeorm.PrimaryColumn)('uuid'), _dec5 = Reflect.metadata("design:type", String), _dec6 = (0, _typeorm.Column)(), _dec7 = Reflect.metadata("design:type", String), _dec8 = (0, _typeorm.Column)(), _dec9 = Reflect.metadata("design:type", String), _dec10 = (0, _typeorm.Column)({
  default: 0
}), _dec11 = Reflect.metadata("design:type", Number), _dec12 = (0, _typeorm.OneToMany)(() => _Transaction.default, transaction => transaction.account), _dec13 = Reflect.metadata("design:type", Array), _dec14 = (0, _typeorm.OneToMany)(() => _Terms.default, terms => terms.account, {
  eager: true
}), _dec15 = Reflect.metadata("design:type", Array), _dec16 = (0, _typeorm.OneToMany)(() => _Essay.default, essay => essay.account), _dec17 = Reflect.metadata("design:type", Array), _dec18 = (0, _typeorm.OneToOne)(() => _Subscription.default, subscription => subscription.account, {
  cascade: true,
  eager: true
}), _dec19 = Reflect.metadata("design:type", typeof _Subscription.default === "undefined" ? Object : _Subscription.default), _dec20 = (0, _typeorm.CreateDateColumn)(), _dec21 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec22 = (0, _typeorm.UpdateDateColumn)(), _dec23 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class Account {
  constructor() {
    _initializerDefineProperty(this, "id", _descriptor, this);

    _initializerDefineProperty(this, "name", _descriptor2, this);

    _initializerDefineProperty(this, "email", _descriptor3, this);

    _initializerDefineProperty(this, "credits", _descriptor4, this);

    _initializerDefineProperty(this, "transactions", _descriptor5, this);

    _initializerDefineProperty(this, "terms", _descriptor6, this);

    _initializerDefineProperty(this, "essays", _descriptor7, this);

    _initializerDefineProperty(this, "subscription", _descriptor8, this);

    _initializerDefineProperty(this, "createdAt", _descriptor9, this);

    _initializerDefineProperty(this, "updatedAt", _descriptor10, this);

    if (!this.id) {
      this.id = (0, _uuid.v4)();
    }
  }

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "name", [_dec6, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "email", [_dec8, _dec9], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "credits", [_dec10, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "transactions", [_dec12, _dec13], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "terms", [_dec14, _dec15], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "essays", [_dec16, _dec17], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "subscription", [_dec18, _dec19], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "createdAt", [_dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "updatedAt", [_dec22, _dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);
var _default = Account;
exports.default = _default;