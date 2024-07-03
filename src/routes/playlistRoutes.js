const express = require("express");
const router = express.Router();
const upload=require('../middlewares/uploadmedia.middlewares');
const library=require('../controllers/library.controller');
const playlist=require('../controllers/playlists.controller');
router.get("/", (req, res) => {
  res.render("Playlist");
});

router.get("/newPlaylist", library.viewMediaForPlaylist);
router.get("/Photoes", library.getPhotoesForPlaylist);
router.get("/Videos", library.getVideosForPlaylist);
router.post("/UploadFile",upload.single('file'), library.handleUploadInDBForNewPlaylist);

router.post('/createPlaylist',playlist.createPlaylist)


module.exports = router;
