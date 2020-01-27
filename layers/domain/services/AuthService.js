const { logDecorator, ErrorHelper } = require('^layers/domain/utilities');
const { UserRepository } = require('^layers/dataAccess/repositories');

const { AuthError } = ErrorHelper;

class AuthService {
  constructor () {
    this.name = AuthService.name;
  }

  async validate (login, password) {
    if (!login || !password) {
      throw new AuthError('invalid login or password');
    }
    const passwordHash = '';
    let user = await UserRepository.findOne({ email: login, password: passwordHash });
    if (!user) {
      let user = await register(login, password);
    }
    return user;
  }

  async register (login, password) {
    const hashedPassword = '';
    const user = {
      email: login,
      password: hashedPassword
    };
    return UserRepository.inserOne(user);
  }
}

module.exports = logDecorator(AuthService);
