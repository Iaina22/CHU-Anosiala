// backend/routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const { fankatoavanaEntana } = require('../controllers/stockController');

// Ity ny lalana hantsoina avy any amin'ny Frontend
router.post('/materiels/valider', fankatoavanaEntana);

module.exports = router;