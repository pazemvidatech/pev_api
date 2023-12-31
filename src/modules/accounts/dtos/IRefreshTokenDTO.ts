export interface IRefreshTokenDTO {
  token: string
}
export interface IResponseDTO {
  token: string
  refresh_token: string
}

export interface IPayload {
  sub: string
  email: string
}
