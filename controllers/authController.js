const { user } = require('../models');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/cathcAsyncHandler');
const globalErrorHandler = require('../utils/globalErrorHandler');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await user.create({ ...req.body, isActive: true });

  // create a jwt token and send it to the user
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token
    // data: {
    //   data: newUser
    // }
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

  const User = await user.findOne({ where: { email } });

  if (!User || !(await User.validPassword(password))) {
    return next(new globalErrorHandler(`Invalid email or password`, 401));
  }

  const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token
  });
});

// protection middleware
exports.protect = catchAsync(async (req, res, next) => {
  // TODO

  // Get Token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') // Get Token and check if its theretsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new globalErrorHandler(`You are not logged in`, 401));
  }

  // verify Token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // check if user still exists
  const verifiedUser = await user.findByPk(decodedToken.id);
  if (!verifiedUser) {
    return next(new globalErrorHandler(`User nolonger exists`, 401));
  }

  // check if user changed password after token issue
  if (verifiedUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new globalErrorHandler(
        `User Changed Password, Log in with new password`,
        401
      )
    );
  }

  // grant acess to the protected route
  req.user = verifiedUser;
  next();
});

// user permission or roles
// takes in roles has an array
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new globalErrorHandler(
          `You dont't have permission to perform this action`,
          403
        )
      );
    }
    next();
  };
};
