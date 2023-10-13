"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ITransactionRepository = _interopRequireDefault(require("../repositories/ITransactionRepository"));

var _tsyringe = require("tsyringe");

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let FindAllTransactionsUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('TransactionRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _ITransactionRepository.default === "undefined" ? Object : _ITransactionRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class FindAllTransactionsUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(data) {
    const {
      page,
      size,
      sort,
      where
    } = data;
    const {
      accountId
    } = where;
    const queryData = {};
    queryData.take = size;
    queryData.skip = (page - 1) * size;
    const [sortBy, orderBy] = sort.split(':');
    queryData.order = {
      [sortBy]: orderBy
    };
    if (accountId) queryData.where = {
      accountId
    };
    const result = await this.transactionRepository.findAll(queryData);
    return {
      size,
      page,
      ...result
    };
  }

}) || _class) || _class) || _class) || _class);
var _default = FindAllTransactionsUseCase;
exports.default = _default;