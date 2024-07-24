const express = require("express");
const router = express.Router();
const upload=require('../middlewares/uploadmedia.middlewares');
// const upload=require('../middlewares/uploadmedia.s3middlewares')
const library=require('../controllers/library.controller');

router.get("/", library.viewMedia);

router.get("/Photos", library.getPhotoes);
router.get("/Videos", library.getVideos);
router.post("/UploadMedia", upload.single('file'), library.handleUploadInDB);
//
router.post("/DeleteMedia/:id", library.deleteMedia);

module.exports = router;