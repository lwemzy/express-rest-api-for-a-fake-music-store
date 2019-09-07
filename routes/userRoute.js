const express = require('express');
const authController = require('../controllers/authController');
const app = express();

app.post('/signup', authController.signup);

module.exports = app;
