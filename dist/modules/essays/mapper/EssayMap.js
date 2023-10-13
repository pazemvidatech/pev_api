"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EssayMap = void 0;

var _classTransformer = require("class-transformer");

class EssayMap {
  static toDTO({
    id,
    status,
    theme,
    text,
    createdAt,
    updatedAt,
    correction
  }) {
    let correctionValue;

    if (correction != null) {
      correctionValue = correction.completion;
    }

    const essay = (0, _classTransformer.classToClass)({
      id,
      correction: correctionValue,
      status,
      theme,
      text,
      createdAt,
      updatedAt
    });
    return essay;
  }

}

exports.EssayMap = EssayMap;