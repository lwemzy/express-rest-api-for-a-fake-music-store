const globalErrorHandler = require('../utils/globalErrorHandler');

// handle errors in deveopment enviroment
const handleErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// handle error in producation development
const handleErrorProd = (err, res) => {
  // handle operational errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // handle programing errors
    console.error('', err);
    res.status(500).json({
      status: 'Error',
      message:
        'A few roaches in the system 🤓!, sending out techinicians to spray them out'
    });
  }
};

// handle duplicate fileds in sequelize
const unquieConstraintErrorHandler = error => {
  const message = error.errors[0].message;
  return new globalErrorHandler(message, 400);
};

// handle sequelize validation errors
const validationErrorHandler = error => {
  const field = error.errors[0].instance.email;
  const message = [field, error.errors[0].message];
  return new globalErrorHandler(message.join(', '), 400);
};

// handling jwt token errors

const invalidTokenHandler = () =>
  new globalErrorHandler(`Invalid JWT token`, 401);

const tokenExpiredHandler = () => new globalErrorHandler(`Expired Token`, 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    handleErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'producation') {
    let error = { ...err };

    if (error.name === 'SequelizeUniqueConstraintError')
      error = unquieConstraintErrorHandler(error);
    if (error.name === 'SequelizeValidationError')
      error = validationErrorHandler(error);

    if (error.name === 'JsonWebTokenError') error = invalidTokenHandler();
    if (error.name === 'TokenExpiredError') error = tokenExpiredHandler();

    handleErrorProd(error, res);
  }
};
