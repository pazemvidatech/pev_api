"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bull = _interopRequireDefault(require("bull"));

var jobsCorrection = _interopRequireWildcard(require("../../modules/essays/jobs"));

var _node = _interopRequireDefault(require("@sentry/node"));

var _cache = _interopRequireDefault(require("../../config/cache"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const queues = Object.values(jobsCorrection).map(job => ({
  bull: new _bull.default(job.key, {
    redis: _cache.default[process.env.NODE_ENV]
  }),
  name: job.key,
  handle: job.handle
}));
var _default = {
  queues,

  add(name, data) {
    const queue = queues.find(queue => queue.name === name);
    return queue.bull.add(data);
  },

  process() {
    return queues.forEach(queue => {
      queue.bull.process(job => queue.handle(job.data));
      queue.bull.on('failed', (job, err) => {
        _node.default.captureException(err);

        console.log('Job failed', queue.name, job.data);
        console.log(err);
      });
    });
  }

};
exports.default = _default;