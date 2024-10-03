// routes/index.js
const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UserController.getMe);
module.exports = router;
