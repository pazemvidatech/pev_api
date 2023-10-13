export interface IAuthenticateAccountRequestDTO {
  email: string
  password: string
}

export interface IAuthenticateAccountResponseDTO {
  account: {
    avatar_url: string
    name: string
    email: string
  }
  token: string
  refresh_token: string
}
