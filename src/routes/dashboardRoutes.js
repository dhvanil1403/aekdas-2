const express = require("express");
const router = express.Router();
const {dashboardAuth}= require('../controllers/userLogin.controller')
const teamRouter=require('./TeamsRoutes');
const screenRouter=require('./screensRoutes');
const libraryRouter=require('./libraryRoutes');


router.use(dashboardAuth)
router.get("/",  (req, res) => {
    res.render("Dashboard", { message: null });
  });

router.use("/Screens",screenRouter);
router.use("/Teams", teamRouter);
router.use("/Library", libraryRouter);
module.exports = router;
