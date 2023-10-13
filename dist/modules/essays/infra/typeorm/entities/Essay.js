"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.essayTableName = void 0;

var _typeorm = require("typeorm");

var _Account = _interopRequireDefault(require("../../../../accounts/infra/typeorm/entities/Account"));

var _EssayStatusEnum = _interopRequireDefault(require("../../../enums/EssayStatusEnum"));

var _uuid = require("uuid");

var _Correction = _interopRequireDefault(require("./Correction"));

var _classTransformer = require("class-transformer");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

const essayTableName = 'essays';
exports.essayTableName = essayTableName;
let Essay = (_dec = (0, _typeorm.Entity)(essayTableName), _dec2 = Reflect.metadata("design:type", Function), _dec3 = Reflect.metadata("design:paramtypes", []), _dec4 = (0, _typeorm.PrimaryColumn)('uuid'), _dec5 = Reflect.metadata("design:type", String), _dec6 = (0, _typeorm.Column)(), _dec7 = Reflect.metadata("design:type", String), _dec8 = (0, _classTransformer.Exclude)(), _dec9 = (0, _typeorm.ManyToOne)(() => _Account.default, account => account.essays, {
  onDelete: 'CASCADE'
}), _dec10 = (0, _typeorm.JoinColumn)({
  name: 'accountId'
}), _dec11 = Reflect.metadata("design:type", typeof _Account.default === "undefined" ? Object : _Account.default), _dec12 = (0, _classTransformer.Exclude)(), _dec13 = (0, _typeorm.OneToOne)(() => _Correction.default, correction => correction.essay, {
  cascade: true
}), _dec14 = Reflect.metadata("design:type", typeof _Correction.default === "undefined" ? Object : _Correction.default), _dec15 = (0, _typeorm.Column)('text', {
  default: _EssayStatusEnum.default.PENDING
}), _dec16 = Reflect.metadata("design:type", typeof _EssayStatusEnum.default === "undefined" ? Object : _EssayStatusEnum.default), _dec17 = (0, _typeorm.Column)('varchar'), _dec18 = Reflect.metadata("design:type", String), _dec19 = (0, _classTransformer.Exclude)(), _dec20 = (0, _typeorm.Column)('text'), _dec21 = Reflect.metadata("design:type", String), _dec22 = (0, _typeorm.UpdateDateColumn)(), _dec23 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec24 = (0, _typeorm.CreateDateColumn)(), _dec25 = Reflect.metadata("design:type", typeof Date === "undefined" ? Object : Date), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class Essay {
  constructor() {
    _initializerDefineProperty(this, "id", _descriptor, this);

    _initializerDefineProperty(this, "accountId", _descriptor2, this);

    _initializerDefineProperty(this, "account", _descriptor3, this);

    _initializerDefineProperty(this, "correction", _descriptor4, this);

    _initializerDefineProperty(this, "status", _descriptor5, this);

    _initializerDefineProperty(this, "theme", _descriptor6, this);

    _initializerDefineProperty(this, "text", _descriptor7, this);

    _initializerDefineProperty(this, "createdAt", _descriptor8, this);

    _initializerDefineProperty(this, "updatedAt", _descriptor9, this);

    if (!this.id) {
      this.id = (0, _uuid.v4)();
    }
  }

}, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "accountId", [_dec6, _dec7], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "account", [_dec8, _dec9, _dec10, _dec11], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "correction", [_dec12, _dec13, _dec14], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "status", [_dec15, _dec16], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "theme", [_dec17, _dec18], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "text", [_dec19, _dec20, _dec21], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "createdAt", [_dec22, _dec23], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "updatedAt", [_dec24, _dec25], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
})), _class2)) || _class) || _class) || _class);
var _default = Essay;
exports.default = _default;