const express = require("express");
const router = express.Router();
const upload=require('../middlewares/uploadmedia.middlewares');
const library=require('../controllers/library.controller');
const playlist=require('../controllers/playlists.controller');
const groupScreen = require("../controllers/groupScreen.controller");

// router.get("/PlaylistEdit/plylistEditScreen", (req, res) => {
//   res.render("selectionNewPlaylist");
// });
router.get('/',playlist.showPlaylist)
router.get("/newPlaylist", library.viewMediaForPlaylist);
router.get("/Photoes", library.getPhotoesForPlaylist);
router.get("/Videos", library.getVideosForPlaylist);
router.post("/UploadFile",upload.single('file'), library.handleUploadInDBForNewPlaylist);
router.post('/createPlaylist',playlist.createPlaylist)
router.get("/PlaylistEdit/plylistEditScreen",playlist.showAvailableScreenForEditPlaylist)
router.get("/PlaylistEdit/:playlistId",playlist.getPlaylistById)
router.get("/newPlaylist/selectScreens",playlist.showAvailableScreen)

module.exports = router;