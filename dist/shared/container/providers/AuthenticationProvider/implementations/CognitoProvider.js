"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _aws = _interopRequireDefault(require("../../../../../config/aws"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _AppError = _interopRequireDefault(require("../../../../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CognitoProvider {
  constructor() {
    this.config = {
      apiVersion: '2016-04-18',
      region: _aws.default.region,
      credentials: _aws.default.credentials
    };
    this.clientId = _aws.default.client_id;
    this.userPoolId = _aws.default.user_pool_id;
    this.awsConfigIdentity = void 0;
    this.awsConfigIdentity = new _awsSdk.default.CognitoIdentityServiceProvider(this.config);
  }

  async resendCodeOrErrorUserExistsSignUp(paramsData) {
    const params = {
      Username: paramsData.username,
      UserPoolId: this.userPoolId
    };
    const paramsSignUp = {
      ClientId: this.clientId,
      Password: paramsData.password,
      Username: paramsData.username,
      UserAttributes: paramsData.userAttr
    };
    const user = await this.awsConfigIdentity.adminGetUser(params).promise();

    if (user.UserStatus === 'UNCONFIRMED') {
      await this.awsConfigIdentity.adminDeleteUser(params).promise();
      await this.awsConfigIdentity.signUp(paramsSignUp).promise();
    } else {
      throw new _AppError.default('User already exists', 409);
    }
  }

  async signUp({
    username,
    password,
    userAttr
  }) {
    const params = {
      ClientId: this.clientId,
      Password: password,
      Username: username,
      UserAttributes: userAttr
    };

    try {
      await this.awsConfigIdentity.signUp(params).promise();
      return true;
    } catch (error) {
      switch (error.code) {
        case 'UsernameExistsException':
          await this.resendCodeOrErrorUserExistsSignUp({
            username,
            password,
            userAttr
          });
          break;

        default:
          throw new _AppError.default(error.code, 500);
      }
    }
  }

  async signIn({
    username,
    password
  }) {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    };

    try {
      const {
        AuthenticationResult
      } = await this.awsConfigIdentity.initiateAuth(params).promise();
      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken,
        expiresIn: AuthenticationResult.ExpiresIn
      };
    } catch (error) {
      const paramsResend = {
        Username: username,
        ClientId: this.clientId
      };

      switch (error.code) {
        case 'UserNotConfirmedException':
          await this.awsConfigIdentity.resendConfirmationCode(paramsResend).promise();
          throw new _AppError.default('Email not confirmed', 403);

        case 'TooManyRequestsException':
          throw new _AppError.default('Too Many requests', 429);

        case 'UserNotFoundException':
          throw new _AppError.default('Incorrect credentials', 401);

        case 'NotAuthorizedException':
          throw new _AppError.default('Incorrect credentials', 401);

        default:
          throw new _AppError.default(error.code, 401);
      }
    }
  }

  async closeAccount(username) {
    const params = {
      Username: username,
      UserPoolId: this.userPoolId
    };

    try {
      await this.awsConfigIdentity.adminDeleteUser(params).promise();
      return true;
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new _AppError.default('Incorrect code', 400);

        case 'CodeExpiredException':
          throw new _AppError.default('Expired code', 400);

        default:
          throw new _AppError.default(error.code, 400);
      }
    }
  }

  async confirmSignUp({
    username,
    code
  }) {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Username: username
    };

    try {
      await this.awsConfigIdentity.confirmSignUp(params).promise();
      return true;
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new _AppError.default('Incorrect code', 400);

        case 'CodeExpiredException':
          throw new _AppError.default('Expired code', 400);

        default:
          throw new _AppError.default(error.code, 400);
      }
    }
  }

  async forgotPassword(username) {
    const params = {
      ClientId: this.clientId,
      Username: username
    };

    try {
      await this.awsConfigIdentity.forgotPassword(params).promise();
      return true;
    } catch (error) {
      return false;
    }
  }

  async newPassword({
    username,
    password,
    code
  }) {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Password: password,
      Username: username
    };

    try {
      await this.awsConfigIdentity.confirmForgotPassword(params).promise();
      return true;
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new _AppError.default('Incorrect code', 400);

        case 'CodeExpiredException':
          throw new _AppError.default('Expired code', 400);

        default:
          throw new _AppError.default(error.code, 400);
      }
    }
  }

  async getUser(username) {
    const params = {
      Username: username,
      UserPoolId: this.userPoolId
    };

    try {
      const user = await this.awsConfigIdentity.adminGetUser(params).promise();
      const attibutes = user.UserAttributes;
      return {
        id: attibutes.find(e => e.Name === 'sub').Value,
        name: attibutes.find(e => e.Name === 'name').Value,
        email: attibutes.find(e => e.Name === 'email').Value,
        isAdmin: attibutes.find(e => e.Name === 'custom:is_admin').Value === '1'
      };
    } catch (error) {
      throw new _AppError.default('Internal Error', 500);
    }
  }

  async verifyToken(accessToken) {
    const params = {
      AccessToken: accessToken
    };

    try {
      const user = await this.awsConfigIdentity.getUser(params).promise();
      const attibutes = user.UserAttributes;
      return {
        id: attibutes.find(e => e.Name === 'sub').Value,
        name: attibutes.find(e => e.Name === 'name').Value,
        email: attibutes.find(e => e.Name === 'email').Value,
        isAdmin: attibutes.find(e => e.Name === 'custom:is_admin').Value === '1'
      };
    } catch (error) {
      throw new _AppError.default('Invalid Token', 401);
    }
  }

  async refreshToken(refreshToken) {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken
      }
    };

    try {
      const {
        AuthenticationResult
      } = await this.awsConfigIdentity.initiateAuth(params).promise();
      return {
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: refreshToken,
        expiresIn: AuthenticationResult.ExpiresIn
      };
    } catch (error) {
      throw new _AppError.default('Internal Error', 500);
    }
  }

  async changePassword({
    accessToken,
    oldPassword,
    newPassword
  }) {
    const params = {
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken
    };

    try {
      await this.awsConfigIdentity.changePassword(params).promise();
      return true;
    } catch (error) {
      switch (error.code) {
        case 'CodeMismatchException':
          throw new _AppError.default('Incorrect password', 401);

        default:
          throw new _AppError.default(error.code, 400);
      }
    }
  }

}

var _default = CognitoProvider;
exports.default = _default;