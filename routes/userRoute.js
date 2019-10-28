const express = require('express');

const app = express();
const authController = require('../controllers/authController');

app.post('/signup', authController.signup);
app.post('/login', authController.login);
module.exports = app;
