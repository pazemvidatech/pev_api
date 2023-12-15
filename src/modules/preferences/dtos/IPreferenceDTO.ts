export enum PreferenceType {
  NUMBER = 'NUMBER',
  AMOUNT = 'AMOUNT',
  STRING = 'STRING',
}

export interface IPreferenceDTO {
  key: string
  value: any
  description: string
  type: PreferenceType
}
