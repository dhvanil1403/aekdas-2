const express = require("express");
const router = express.Router();
const upload=require('../middlewares/uploadmedia.middlewares');
const library=require('../controllers/library.controller');

router.get("/", library.viewMedia);


router.post("/UploadMedia", upload.single('file'), library.handleUploadInDB);

module.exports = router;