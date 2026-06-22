const express = require("express");
const router = express.Router();
const historiqueController = require("../controllers/historiqueController");

// API hahitana ny tantara rehetra
router.get("/", historiqueController.getHistoriqueList);

module.exports = router;