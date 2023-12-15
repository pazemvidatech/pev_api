import IFeatureFlagProvider from '../models/IFeatureFlagProvider'
import admin from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'
import { ExplicitParameterValue } from 'firebase-admin/lib/remote-config/remote-config-api'
import { ICreateFeatureFlagDTO } from '../dtos/ICreateFeatureFlagDTO'
import { preferences } from 'mercadopago'
import {
  IPreferenceDTO,
  PreferenceType,
} from '@modules/preferences/dtos/IPreferenceDTO'

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

  async getPreference(key: string): Promise<string | boolean | null> {
    // Obtém o modelo de configuração
    const template = await this.remoteConfigIdentity.getTemplate()

    const preferences = template.parameterGroups.preferences

    // Verifica se a configuração existe
    if (preferences.parameters && preferences.parameters[key]) {
      // Retorna o valor da configuração
      const defaultValue = preferences.parameters[key]
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

  async getAllPreferences(): Promise<IPreferenceDTO[]> {
    const allConfigs = await this.remoteConfigIdentity.getTemplate()

    const preferencesParameters =
      allConfigs.parameterGroups.preferences.parameters

    var listPreferences: IPreferenceDTO[] = []

    for (const key in preferencesParameters) {
      if (preferencesParameters.hasOwnProperty(key)) {
        listPreferences.push({
          key: key,
          value: (preferencesParameters[key]
            .defaultValue as ExplicitParameterValue).value,
          description: preferencesParameters[key].description,
          type: key.includes('Amount')
            ? PreferenceType.AMOUNT
            : preferencesParameters[key].valueType === 'NUMBER'
            ? PreferenceType.NUMBER
            : PreferenceType.STRING,
        })
      }
    }
    return listPreferences
  }

  async updatePreferences(
    listPreferences: IPreferenceDTO[],
  ): Promise<IPreferenceDTO[]> {
    const allConfigs = await this.remoteConfigIdentity.getTemplate()

    const preferencesParameters =
      allConfigs.parameterGroups.preferences.parameters

    listPreferences.forEach(preference => {
      const preferenceKey = preference.key
      if (preferencesParameters.hasOwnProperty(preferenceKey)) {
        // Atualiza o valor da preferência
        preferencesParameters[preferenceKey].defaultValue = {
          value: preference.value,
        }
      }
    })

    await this.remoteConfigIdentity.publishTemplate(allConfigs)

    return listPreferences
  }
}

export default FirebaseMessagingProvider
