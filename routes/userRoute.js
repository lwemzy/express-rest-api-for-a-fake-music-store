const express = require('express');
const authController = require('../controllers/authController');
const app = express();

app.post('/signup', authController.signup);
app.post('/login', authController.login);
module.exports = app;
