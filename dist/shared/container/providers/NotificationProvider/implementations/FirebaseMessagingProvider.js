"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _serviceAccountKey = _interopRequireDefault(require("./serviceAccountKey.json"));

var _serviceAccountKeyDev = _interopRequireDefault(require("./serviceAccountKeyDev.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FirebaseMessagingProvider {
  constructor() {
    this.notificationIdentity = void 0;
    this.notificationIdentity = _firebaseAdmin.default;

    if (!_firebaseAdmin.default.apps.length) {
      this.notificationIdentity.initializeApp({
        credential: _firebaseAdmin.default.credential.cert(process.env.NODE_ENV === 'production' ? _serviceAccountKey.default : _serviceAccountKeyDev.default)
      });
    }
  }

  async createNotification(data) {
    const {
      token,
      title,
      content
    } = data;
    return _firebaseAdmin.default.messaging().send({
      token,
      notification: {
        title,
        body: content
      }
    }).then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

}

var _default = FirebaseMessagingProvider;
exports.default = _default;