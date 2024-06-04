const express = require("express");
const router = express.Router();
const screen = require('../controllers/newScreen.controller');
const groupRouter=require('./groupsRoutes');

// GET all not deleted screens
router.get("/", screen.getNotdeletedScreen);

// POST a new screen
router.post("/", screen.addScreen);
router.get('/GroupScreen',screen.showGroupScreen)

router.use("/Groups", groupRouter);

// POST request to mark a screen as deleted
router.post('/mark-as-deleted', screen.updateDeleteScreen);

// GET all deleted screens
router.get('/Deleted-Screen', screen.getDeletedScreens);

// GET screen details by pairing code
router.get('/:pairingCode', screen.screenByPairingCode);

// POST request to edit a screen
router.post('/edit-screen', screen.editScreen);

// GET request to display edit screen form
router.get('/edit-screen', screen.getNotdeletedScreen); 

module.exports = router;

