import ISignInDTO from '../dtos/ISignInDTO'
import ICreateUserDTO from '../dtos/ICreateUserDTO'
import IConfirmSignUpDTO from '../dtos/IConfirmSignUpDTO'
import INewPasswordDTO from '../dtos/INewPasswordDTO'
import IAuthenticationProvider from '../models/IAuthenticationProvider'
import awsConfig from '@config/aws'
import AWS from 'aws-sdk'
import AppError from '@shared/errors/AppError'
import IGetUserResponseDTO from '../dtos/IGetUserResponseDTO'
import ISignInResponseDTO from '../dtos/ISignInResponseDTO'
import IChangePasswordDTO from '../dtos/IChangePasswordDTO'

class CognitoProvider implements IAuthenticationProvider {
  private config = {
    region: awsConfig.region,
    credentials: awsConfig.credentials,
  }

  private clientId = awsConfig.client_id
  private userPoolId = awsConfig.user_pool_id

  private awsConfigIdentity: AWS.CognitoIdentityServiceProvider

  constructor() {
    this.awsConfigIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
  }

  public async createUser({
    username,
    userAttr,
  }: ICreateUserDTO): Promise<string> {
    const params = {
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: userAttr,
      DesiredDeliveryMediums: ['EMAIL'],
      ForceAliasCreation: false,
      //TemporaryPassword: 'Password1!',
    }

    try {
      var user = await this.awsConfigIdentity.adminCreateUser(params).promise()

      return user.User.Attributes.find(e => e.Name === 'sub').Value
    } catch (error) {
      switch (error.code) {
        case 'TooManyRequestsException':
          throw new AppError('Too Many requests', 429)
        case 'UsernameExistsException':
          throw new AppError('User already exists', 409)
        default:
          throw new AppError(error.code, 500)
      }
    }
  }

  public async signIn({
    username,
    password,
  }: ISignInDTO): Promise<ISignInResponseDTO> {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }

    try {
      const {
        AuthenticationResult,
        Session,
      } = await this.awsConfigIdentity.initiateAuth(params).promise()

      if (AuthenticationResult) {
        return {
          accessToken: AuthenticationResult.AccessToken,
          refreshToken: AuthenticationResult.RefreshToken,
          expiresIn: AuthenticationResult.ExpiresIn,
        }
      }

      const paramsSecond = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: this.clientId,
        UserPoolId: this.userPoolId,
        ChallengeResponses: {
          USERNAME: username,
          NEW_PASSWORD: password,
        },
        Session,
      }

      const auth = await this.awsConfigIdentity
        .adminRespondToAuthChallenge(paramsSecond)
        .promise()

      return {
        accessToken: auth.AuthenticationResult.AccessToken,
        refreshToken: auth.AuthenticationResult.RefreshToken,
        expiresIn: auth.AuthenticationResult.ExpiresIn,
      }
    } catch (error) {
      const paramsResend = {
        Username: username,
        ClientId: this.clientId,
      }

      switch (error.code) {
        case 'UserNotConfirmedException':
          await this.awsConfigIdentity
            .resendConfirmationCode(paramsResend)
            .promise()
          throw new AppError('Email not confirmed', 403)
        case 'TooManyRequestsException':
          throw new AppError('Too Many requests', 429)
        case 'UserNotFoundException':
          throw new AppError('Incorrect credentials', 401)
        case 'NotAuthorizedException':
          throw new AppError('Incorrect credentials', 401)
        default:
          throw new AppError(error.code, 401)
      }
    }
  }

  public async closeAccount(username: string): Promise<boolean> {
    const params = {
      Username: username,
      UserPoolId: this.userPoolId,
    }

    try {
      await this.awsConfigIdentity.adminDeleteUser(params).promise()
      return true
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new AppError('Incorrect code', 400)
        case 'CodeExpiredException':
          throw new AppError('Expired code', 400)
        default:
          throw new AppError(error.code, 400)
      }
    }
  }

  public async confirmSignUp({
    username,
    code,
  }: IConfirmSignUpDTO): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Username: username,
    }

    try {
      await this.awsConfigIdentity.confirmSignUp(params).promise()
      return true
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new AppError('Incorrect code', 400)
        case 'CodeExpiredException':
          throw new AppError('Expired code', 400)
        default:
          throw new AppError(error.code, 400)
      }
    }
  }

  public async forgotPassword(username: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      Username: username,
    }

    try {
      await this.awsConfigIdentity.forgotPassword(params).promise()
      return true
    } catch (error) {
      return false
    }
  }

  public async newPassword({
    username,
    password,
    code,
  }: INewPasswordDTO): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Password: password,
      Username: username,
    }

    try {
      await this.awsConfigIdentity.confirmForgotPassword(params).promise()

      return true
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new AppError('Incorrect code', 400)
        case 'CodeExpiredException':
          throw new AppError('Expired code', 400)
        default:
          throw new AppError(error.code, 400)
      }
    }
  }

  public async getUser(username: string): Promise<IGetUserResponseDTO> {
    const params = { Username: username, UserPoolId: this.userPoolId }

    try {
      const user = await this.awsConfigIdentity.adminGetUser(params).promise()

      const attibutes = user.UserAttributes
      const username = user.Username
      return {
        id: attibutes.find(e => e.Name === 'sub').Value,
        name: attibutes.find(e => e.Name === 'name').Value,
        email: attibutes.find(e => e.Name === 'email').Value,
        username,
        role: Number(attibutes.find(e => e.Name === 'custom:role').Value),
        isAdmin: attibutes.find(e => e.Name === 'custom:role').Value === '1',
      }
    } catch (error) {
      throw new AppError('Internal Error', 500)
    }
  }

  public async verifyToken(accessToken: string): Promise<IGetUserResponseDTO> {
    const params = { AccessToken: accessToken }

    try {
      const user = await this.awsConfigIdentity.getUser(params).promise()

      const attibutes = user.UserAttributes
      const username = user.Username
      return {
        id: attibutes.find(e => e.Name === 'sub').Value,
        name: attibutes.find(e => e.Name === 'name').Value,
        email: attibutes.find(e => e.Name === 'email').Value,
        username,
        role: Number(attibutes.find(e => e.Name === 'custom:role').Value),
        isAdmin: attibutes.find(e => e.Name === 'custom:role').Value === '1',
      }
    } catch (error) {
      throw new AppError('Invalid Token', 401)
    }
  }

  public async refreshToken(refreshToken: string): Promise<ISignInResponseDTO> {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    }

    try {
      const {
        AuthenticationResult,
      } = await this.awsConfigIdentity.initiateAuth(params).promise()
      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: refreshToken,
        expiresIn: AuthenticationResult.ExpiresIn,
      }
    } catch (error) {
      throw new AppError('Internal Error', 500)
    }
  }

  public async changePassword({
    accessToken,
    oldPassword,
    newPassword,
  }: IChangePasswordDTO): Promise<boolean> {
    const params = {
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken,
    }

    try {
      await this.awsConfigIdentity.changePassword(params).promise()
      return true
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new AppError('Incorrect password', 401)
        default:
          throw new AppError(error.code, 400)
      }
    }
  }
}

export default CognitoProvider
