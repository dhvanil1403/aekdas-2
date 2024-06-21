const library = require("../models/library.model");

const handleUploadInDB = async (req, res) => {
  if(!req.file){
    return res.status(400).send("No file upladed");
  }
  const fileUrl = req.file.path;
  const fileType = req.file.mimetype;
  try {
    await library.uploadMediaInDB(fileUrl, fileType);

    const mediafiles = await library.viewMedia();
    const fileCount = await library.getmediafileCount();
    // console.log(mediafiles); // Check the media files array in console
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
};

const viewMedia = async (req, res) => {
  try {
    const mediafiles = await library.viewMedia();
    const fileCount = await library.getmediafileCount();
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing media");
  }
};

const getPhotoes = async (req, res) => {
  try {
    const mediafiles = await library.getPhotoes();
    const fileCount = await library.getmediafileCount();
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing Photoes");
  }
};

const getVideos = async (req, res) => {
  try {
    const mediafiles = await library.getVideos();
    const fileCount = await library.getmediafileCount();
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing video media");
  }
};
module.exports = {
  handleUploadInDB,
  viewMedia,
  getPhotoes,
  getVideos,
};
