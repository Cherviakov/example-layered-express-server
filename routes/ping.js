const router = require('express').Router();
const { HEADERS } = require('^constants');

router.head('/ping', (req, res) => {
  res.setHeader(HEADERS.PONG, 'ping');
  res.status(200).end();
});

module.exports = router;
