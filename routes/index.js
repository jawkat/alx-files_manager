// routes/index.js
const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController'); // Importer AppController
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');

// Définir les routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);
router.post('/connect', AuthController.getConnect);
router.post('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

module.exports = router;
