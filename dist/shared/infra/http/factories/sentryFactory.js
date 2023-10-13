"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Tracing = _interopRequireWildcard(require("@sentry/tracing"));

var Sentry = _interopRequireWildcard(require("@sentry/node"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class SentryFactory {
  init(app) {
    if (process.env.NODE_ENV !== 'test') {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [new Sentry.Integrations.Http({
          tracing: true
        }), new Tracing.Integrations.Express({
          app
        })],
        tracesSampleRate: 1.0
      });
      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }
  }

  error(app) {
    if (process.env.NODE_ENV !== 'test') {
      app.use(Sentry.Handlers.errorHandler());
    }
  }

}

var _default = new SentryFactory();

exports.default = _default;