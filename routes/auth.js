const router = require('express').Router();
const { AuthService } = require('^layers/domain/services');
const JWT = require('^JWT');
const { HEADERS } = require('^constants');

router.post('/', async (req, res) => {
  const { login, password } = req.body;
  try {
    const { _id:userId, name, email, photo, } = await AuthService.validate(login, password) || {};
    if (userId) {
      const { accessToken, refreshToken, expires } = JWT.generateTokens(userId);
      const result = {
        accessToken,
        refreshToken,
        expires,
        user: {
          id: userId,
          name,
          email,
          photo,
        },
      };
      res.status(200).send(result);
    } else {
      res.status(401).send('unauthorized');
    }
  } catch (err) {
    ErrorHelper.handleErrorResponse(res, err);
  }
});

router.post('/refresh', async (req, res) => {
  const [authType, accessToken] = (req.get(HEADERS.TOKEN) || '').split(' ');
  if (authType !== 'Bearer' || !accessToken) {
    res.status(401).send('invalid or expired token');
  } else {
    const refreshToken = req.body;
    const refreshDecoded = JWT.validate(refreshToken);
    // if refresh not valid 401
    const accessDecoded = JWT.isExpired(accessToken);
    // if access not valid 401
    // if access valid but no expired return it with its expired
    // if access valid but expired generate new one
    res.status(200).send('test');
  }
});

module.exports = router;
