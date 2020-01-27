const router = require('express').Router();
const { jwt, basic } = require('^middlewares');
const auth = require('./auth');
const items = require('./items');
const ping = require('./ping');

router.use('/auth', auth);
router.use('/items', jwt, items);
router.use('/ping', basic.ping, ping);

module.exports = router;
