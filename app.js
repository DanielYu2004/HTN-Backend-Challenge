const express = require('express');
const httpStatus = require('http-status');
const routes = require('./routes');
const { errorHandler, ApiError } = require('./utils');

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// send back 404 for unknown requests
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// error handler middleware
app.use(errorHandler);

module.exports = app;
