// routes/index.js
const express = require('express');

const api = express.Router();
const AuthController = require('../controllers/AuthController');
const AppController = require('../controllers/AppController');

api.get('/status', AppController.getStatus);
api.get('/stats', AppController.getStats);

api.get('/connect', AuthController.getConnect);
api.get('/disconnect', AuthController.getDisconnect);
module.exports = api;
