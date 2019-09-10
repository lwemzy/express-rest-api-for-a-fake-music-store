const User = require('../models').user;
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/cathcAsyncHandler');
const globalErrorHandler = require('../utils/globalErrorHandler');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // create a jwt token and send it to the user
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      data: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // todo
  // check if email and password exits on request body
  // check if user and password exit in db
  // if all ok send signed jwt token for user login

  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new globalErrorHandler('Please Provide email and password to login', 403)
    );
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.validPassword(password))) {
    return next(new globalErrorHandler(`Invalid email or password`, 401));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token
  });
});
