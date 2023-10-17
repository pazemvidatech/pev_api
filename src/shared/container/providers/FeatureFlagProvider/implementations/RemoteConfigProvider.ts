import IFeatureFlagProvider from '../models/IFeatureFlagProvider'
import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'
import { ExplicitParameterValue } from 'firebase-admin/lib/remote-config/remote-config-api'
import { ICreateFeatureFlagDTO } from '../dtos/ICreateFeatureFlagDTO'

class FirebaseMessagingProvider implements IFeatureFlagProvider {
  private remoteConfigIdentity: admin.remoteConfig.RemoteConfig

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as unknown),
      })
    }

    this.remoteConfigIdentity = admin.remoteConfig()
  }

  async getConfig(key: string): Promise<string | boolean | null> {
    // Obtém o modelo de configuração
    const template = await this.remoteConfigIdentity.getTemplate()

    // Verifica se a configuração existe
    if (template.parameters && template.parameters[key]) {
      // Retorna o valor da configuração
      const defaultValue = template.parameters[key]
        .defaultValue as ExplicitParameterValue

      const value = defaultValue.value

      if (value === 'true') return true
      if (value === 'false') return false

      return value
    } else {
      // Retorna null se a configuração não existir
      return null
    }
  }

  // Um método para definir uma configuração
  async setConfig({ key, value }: ICreateFeatureFlagDTO): Promise<void> {
    // Obtém o modelo de configuração
    const template = await this.remoteConfigIdentity.getTemplate()

    // Define a configuração
    template.parameters = {
      ...template.parameters,
      [key]: {
        defaultValue: {
          value: value,
        },
      },
    }
  }
}

export default FirebaseMessagingProvider
