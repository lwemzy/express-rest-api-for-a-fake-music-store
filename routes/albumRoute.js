const express = require('express');
const app = express();

const albumController = require('../controllers/albumController');

app.route('/').post(albumController.createAlbum);

module.exports = app;
