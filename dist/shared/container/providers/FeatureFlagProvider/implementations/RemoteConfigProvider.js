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
    this.remoteConfigIdentity = void 0;

    if (!_firebaseAdmin.default.apps.length) {
      _firebaseAdmin.default.initializeApp({
        credential: _firebaseAdmin.default.credential.cert(process.env.NODE_ENV === 'production' ? _serviceAccountKey.default : _serviceAccountKeyDev.default)
      });
    }

    this.remoteConfigIdentity = _firebaseAdmin.default.remoteConfig();
  }

  async getConfig(key) {
    // Obtém o modelo de configuração
    const template = await this.remoteConfigIdentity.getTemplate(); // Verifica se a configuração existe

    if (template.parameters && template.parameters[key]) {
      // Retorna o valor da configuração
      const defaultValue = template.parameters[key].defaultValue;
      const value = defaultValue.value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    } else {
      // Retorna null se a configuração não existir
      return null;
    }
  } // Um método para definir uma configuração


  async setConfig({
    key,
    value
  }) {
    // Obtém o modelo de configuração
    const template = await this.remoteConfigIdentity.getTemplate(); // Define a configuração

    template.parameters = { ...template.parameters,
      [key]: {
        defaultValue: {
          value: value
        }
      }
    };
  }

}

var _default = FirebaseMessagingProvider;
exports.default = _default;