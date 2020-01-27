const { ERROR_NAMES } = require('^constants');
const LogHelper = require('./LogHelper');

class NamedError extends Error {
  constructor (name, message, status) {
    super();
    this.name = name;
    this.message = message;
    this.status = status;
  }
}

class ValidationError extends NamedError {
  constructor (message) {
    super(ERROR_NAMES.VALIDATION, message, 400);
  }
}

class AuthError extends NamedError {
  constructor (message) {
    super(ERROR_NAMES.AUTH, message, 401);
  }
}

class ForbiddenError extends NamedError {
  constructor (message) {
    super(ERROR_NAMES.FORBIDDEN, message, 403);
  }
}

class NotExistError extends NamedError {
  constructor (message) {
    super(ERROR_NAMES.NOT_EXIST, message, 404);
  }
}

const handleErrorResponse = (res, err) => {
  if (res instanceof Error) {
    res.status(500).send('internal server error');
    throw new Error('incorrect argument order');
  }
  if ([ValidationError, AuthError, ForbiddenError, NotExistError].some((cl) => err instanceof cl)) {
    if (res.req.method === 'HEAD') {
      res.setHeader('X-ERROR', err.message);
    }
    res.status(err.status).send(err.message);
  } else {
    if (isProd === true) {
      LogHelper.error(err.stack.replace(/\n/g,''));
    } else {
      LogHelper.error(err.stack);
    }
    res.status(500).send('internal server error');
  }
}

module.exports = {
  NamedError,
  ValidationError,
  AuthError,
  ForbiddenError,
  NotExistError,
  handleErrorResponse,
}
