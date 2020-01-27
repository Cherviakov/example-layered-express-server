const { createLogger, format, transports } = require('winston');
const moment = require('moment');
require('./cycle');
const { LOG_LEVELS } = require('^constants');

const { LOG_LEVEL, LOG_TYPE } = process.env;
const { combine, timestamp, label, printf } = format;
const levels = Object.values(LOG_LEVELS).reduce((acc, level, index) => {
  acc[level] = index;
  return acc;
}, {});

const logFormat = () => {
  return printf((info) => {
    const stringObject = stringify(info.object);
    return `${moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss')} [${info.type || ''}] ${info.level} ${info.message || ''} ${stringObject}`;
  });
}

const filter = () => {
  return format((info) => {
    if (info.type !== 'general' && info.label && info.type !== info.label) {
      return false;
    }
    return info;
  });
}

const stringify = (message = '') => {
  if (typeof message === 'object') {
    try {
      return JSON.stringify(JSON.decycle(message));
    } catch (err) {
      return 'unknown message';
    }
  }
  return message.toString();
}

class LogHelper {
  constructor (level = LOG_LEVEL || LOG_LEVELS.INFO, logType = LOG_TYPE) {
    if (!Object.values(LOG_LEVELS).includes(level)) {
      throw new Error(`logLevel must be one of ${Object.values(LOG_LEVELS).join(' ')}`);
    }
    this.logger = createLogger({
      levels,
      level,
      logType,
      format: combine(
        label({ label: logType }),
        filter()(),
        timestamp(),
        logFormat(),
      ),
      transports: [new transports.Console],
      exitOnError: false,
    });
    this.logger.on('error', (err) => {
      console.error('logger error happened', err);
    });
    this.info('logLevel is', this.logger.level, 'general');
  }

  log (level, message, object, type) {
    return this.logger.log({ level, message, object, type });
  }

  error (...args) {
    this.log('error', ...args);
  }

  warn (...args) {
    this.log('warn', ...args);
  }

  info (...args) {
    this.log('info', ...args);
  }

  verbose (...args) {
    this.log('debug', ...args);
  }

  debug (...args) {
    this.log('debug', ...args);
  }

  silly (...args) {
    this.log('all', ...args);
  }
}

module.exports = new LogHelper;
