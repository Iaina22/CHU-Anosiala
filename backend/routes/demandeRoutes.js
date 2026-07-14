const express = require("express");
const router = express.Router();

const controller = require("../controllers/demandeController");

const { updateDemandeStatus } = require("../controllers/demandeController");



router.get("/all", controller.getAllDemandes);

// GET BY USER
router.get("/user/:id", controller.getDemandesByUser);

router.post("/", controller.addDemande);

// UPDATE STATUS
// UPDATE STATUS
router.put("/:id/status", updateDemandeStatus);

// NOUVELLE ROUTE POUR LE BADGE DE LA NAVBAR
router.get("/notifications", controller.getNotifications);
// ROUTE HANASORAN'NY BADGE MENA
router.put("/notifications/read", controller.markNotificationsAsRead);

module.exports = router;