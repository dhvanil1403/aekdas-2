const express = require("express");
const router = express.Router();
const groupScreen = require("../controllers/groupScreen.controller");

router.get('/',groupScreen.showAvailableScreen);

router.post("/",groupScreen.createGroup);
module.exports = router;