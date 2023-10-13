import { classToClass } from 'class-transformer'

import IShowEssayResponseDTO from '../dtos/IShowEssayResponseDTO'
import Essay from '../infra/typeorm/entities/Essay'

export class EssayMap {
  static toDTO({
    id,
    status,
    theme,
    text,
    createdAt,
    updatedAt,
    correction,
  }: Essay): IShowEssayResponseDTO {
    let correctionValue: string | undefined
    if (correction != null) {
      correctionValue = correction.completion
    }
    const essay = classToClass({
      id,
      correction: correctionValue,
      status,
      theme,
      text,
      createdAt,
      updatedAt,
    })
    return essay
  }
}
