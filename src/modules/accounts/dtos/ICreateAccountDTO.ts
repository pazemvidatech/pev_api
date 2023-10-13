export interface ICreateAccountRequestDTO {
  id: string
  name: string
  email: string
  username: string
  role: number
}

export interface ICreateAccountResponseDTO {
  expiresIn: number
  accessToken: string
  refreshToken: string
}
