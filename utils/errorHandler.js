const httpStatus = require('http-status');
const ApiError = require('./ApiError');

/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
  };

  // TODO: winston logger
  // console.error(err);

  return res.status(statusCode).send(response);
};

module.exports = {
  errorHandler,
};
