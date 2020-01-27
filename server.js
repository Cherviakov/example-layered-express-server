const http = require('http');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const logger = require('morgan');
require('dotenv').config();
require('rooty')();
const { LogHelper } = require('^layers/domain/utilities');
const routes = require('^routes');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(';').filter((o) => o != null);

LogHelper.debug(`isProd: ${isProd}`, 'general');
LogHelper.debug(`port: ${port}`, 'general');
LogHelper.debug(`allowed origins: ${allowedOrigins.join(' ')}`);

app.use(helmet());
app.use(compression());
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '2mb', type: 'image/png' }));

if (isProd) {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}

app.use('/', routes);

const server = http.createServer(app);
server.listen(port, () => {
  LogHelper.info(`server listening on port ${port}`, {}, 'general');
});
