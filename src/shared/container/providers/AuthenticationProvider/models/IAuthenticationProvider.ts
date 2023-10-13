import ISignInDTO from '../dtos/ISignInDTO'
import ICreateUserDTO from '../dtos/ICreateUserDTO'
import IConfirmSignUpDTO from '../dtos/IConfirmSignUpDTO'
import INewPasswordDTO from '../dtos/INewPasswordDTO'
import IGetUserResponseDTO from '../dtos/IGetUserResponseDTO'
import ISignInResponseDTO from '../dtos/ISignInResponseDTO'
import IChangePasswordDTO from '../dtos/IChangePasswordDTO'

export default interface IAuthenticationProvider {
  signIn(data: ISignInDTO): Promise<ISignInResponseDTO>
  createUser(data: ICreateUserDTO): Promise<string>
  confirmSignUp(data: IConfirmSignUpDTO): Promise<boolean>
  forgotPassword(username: string): Promise<boolean>
  newPassword(data: INewPasswordDTO): Promise<boolean>
  getUser(username: string): Promise<IGetUserResponseDTO>
  verifyToken(accessToken: string): Promise<IGetUserResponseDTO>
  refreshToken(refreshToken: string): Promise<ISignInResponseDTO>
  changePassword(data: IChangePasswordDTO): Promise<boolean>
  closeAccount(username: string): Promise<boolean>
}
