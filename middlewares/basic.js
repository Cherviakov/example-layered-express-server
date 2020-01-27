const basicAuth = require('basic-auth');

const getBasicMiddleware = (login, password) => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      next();
    } else {
      const { name, pass } = basicAuth(req) || {};
      if (!name || !pass || !login || !password || name !== login || pass !== password) {
        res.status(401).send('unauthorized');
      } else {
        next();
      }
    }
  }
}

const { PING_BASIC_LOGIN_PASS = '' } = process.env;
const [pingLogin, pingPass] = PING_BASIC_LOGIN_PASS.split(' ');

module.exports = {
  ping: getBasicMiddleware(pingLogin, pingPass),
}
