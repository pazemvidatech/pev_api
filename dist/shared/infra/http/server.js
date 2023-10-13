"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "app", {
  enumerable: true,
  get: function () {
    return _app.app;
  }
});
exports.server = void 0;

var _app = require("./app");

var _http = require("http");

const server = (0, _http.createServer)(_app.app).listen(process.env.PORT || 3000);
exports.server = server;