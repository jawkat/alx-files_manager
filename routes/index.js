// routes/index.js
const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController'); // Importer AppController
const UsersController = require('../controllers/UsersController');

// Définir les routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);

module.exports = router;
