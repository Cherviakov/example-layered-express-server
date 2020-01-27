const { logDecorator, GETHelper } = require('^layers/domain/utilities');
const { UserRepository } = require('^layers/dataAccess/repositories');

class UserService {
  getUsers (headers, queryParams) {
    const GetHelper = new GETHelper(headers, queryParams);
    const { query, projection, options } = GetHelper.parse();
    return UserRepository.find(query, projection, params);
  }
}

module.exports = logDecorator(UserService);
