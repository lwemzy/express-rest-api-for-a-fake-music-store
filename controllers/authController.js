const User = require('../models').user;
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: 'Fail',
      message: error
    });
  }
};
