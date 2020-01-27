const { HEADERS } = require('^constants');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(' ');
const baseHeaders = [
  'Origin',
  'Authorization',
  'Content-Type',
  'Accept',
];
const allowedHeaders = baseHeaders.concat(Object.values(HEADERS));
module.exports = (req, res, next) => {
  const origin = req.get('Origin');
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS HEAD, GET, PUT, POST, DELETE'
    );
    res.header('Access-Control-Allow-Headers', allowedHeaders.join());
    res.header('Access-Control-Expose-Headers', allowedHeaders.join());
  }
  next();
}
