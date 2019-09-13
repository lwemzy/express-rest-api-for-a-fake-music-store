const express = require('express');

const app = express();
const artistRouter = require('./routes/artistRoute');
const albumRouter = require('./routes/albumRoute');
const userRouter = require('./routes/userRoute');
const morgan = require('morgan');
const globalErrorHandler = require('./utils/globalErrorHandler');
const globalErrorHandlerController = require('./controllers/errorController');

// morgan logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/musicApi/v1/artist', artistRouter);
app.use('/musicApi/v1/album', albumRouter);
app.use('/musicApi/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(
    new globalErrorHandler(`Can't find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrorHandlerController);

module.exports = app;
