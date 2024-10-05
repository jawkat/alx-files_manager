// routes/index.js
const express = require('express');

const api = express.Router();
const AuthController = require('../controllers/AuthController');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const FilesController = require('../controllers/FilesController');

api.get('/status', AppController.getStatus);
api.get('/stats', AppController.getStats);

api.get('/users', UsersController.postNew);

api.post('/files', FilesController.postUpload);

api.get('/connect', AuthController.getConnect);
api.get('/disconnect', AuthController.getDisconnect);
api.get('/users/me', UsersController.getMe);
module.exports = api;
