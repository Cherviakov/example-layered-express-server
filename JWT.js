const fs = require('fs');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH || '/path/to/private/key');
const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH || '/path/to/public/key');

class JWT {
  #privateKey
  #publicKey
  constructor () {
    this.#privateKey = privateKey;
    this.#publicKey = publicKey;
  }

  generate (userId) {
    const { accessToken, expires } = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    return {
      accessToken,
      refreshToken,
      expires,
    }
  }

  generateAccessToken (userId) {
    const payload = {
      userId,
    };
    const exp = moment().add(1, 'hours').unix();
    const options = {
      algorithm: 'PS512',
      aud: 'website',
      iss: 'server',
      exp,
      iat: moment().unix(),
    };
    const accessToken = jwt.sing(payload, this.#privateKey, options);
    return { accessTokne, expires: exp };
  }

  generateRefreshToken (userId) {
    const payload = {
      userId,
    };
    const options = {
      algorithm: 'PS512',
      aud: 'website',
      iss: 'server',
      exp: moment().add(1, 'months').unix(),
      iat: moment().unix(),
    };
    return jwt.sing(payload, this.#privateKey, options);
  }

  isAccessValidExpired (accessToken) {
    const options = {
      algorithms: ['PS512'],
      iss: 'server',
      ignoreExpiration: true,
      complete: true,
    };
    const { header } = jwt.verify(accessToken, this.#publicKey);
    if (moment().isAfter(moment(header.exp))) {
      return true;
    }
    return false;
  }

  isRefreshValid () {
    const options = {
      algorithms: ['PS512'],
      iss: 'server',
    };
    jwt.verify(accessToken, this.#publicKey);
    return true;
  }
}

module.exports = new JWT;
