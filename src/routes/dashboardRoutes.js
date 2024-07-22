const express = require("express");
const router = express.Router();
const {dashboardAuth}= require('../controllers/userLogin.controller')
const teamRouter=require('./TeamsRoutes');
const screenRouter=require('./screensRoutes');
const libraryRouter=require('./libraryRoutes');
const playlistRouter=require('./playlistRoutes');
const liveContentRouter=require('./liveContentRoutes');


const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
      next(); // User is authenticated, proceed to dashboard
  } else {
      res.redirect('/login'); // Redirect to login if user is not authenticated
  }
};
//  router.use(dashboardAuth)
router.get("/", isAuthenticated, (req, res) => {
    res.render("Dashboard", { message: null });
  });

router.use("/Screens",screenRouter);
router.use("/Teams", teamRouter);
router.use("/Library", libraryRouter);
router.use("/Playlist", playlistRouter );
router.use("/LiveContent", liveContentRouter );



module.exports = router;
