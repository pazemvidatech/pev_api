export default interface ICreateOldRenegotiationDTO {
  customerId?: string
  amount?: number
  negotiator?: string
  initialMonth?: number
  initialYear?: number
  finalMonth?: number
  finalYear?: number
}
