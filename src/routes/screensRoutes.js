const express = require("express");
const router = express.Router();
const screen = require("../controllers/newScreen.controller");
const groupRouter = require("./groupsRoutes");

// GET all not deleted screens
router.route("/").get(screen.getNotdeletedScreen).post(screen.addScreen);

// Group screen route
// router.get("/GroupScreen", screen.showGroupScreen);

// Use groupRouter for '/Groups' path
router.use("/Groups", groupRouter);

// POST request to mark a screen as deleted
router
  .route("/mark-as-deleted")
  .post(screen.updateDeleteScreen)
 
router
  .route("/restore")
  .post(screen.restoreScreen)
  .get(screen.getNotdeletedScreen);

// GET all deleted screens
// router.get('/Deleted-Screen', screen.getDeletedScreens);

// GET screen details by pairing code
router.get("/:pairingCode", screen.screenByPairingCode);

// Routes for editing screen
router
  .route("/edit-screen")
  .post(screen.editScreen)
  .get(screen.getNotdeletedScreen);

module.exports = router;
