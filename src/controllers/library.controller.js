const library = require("../models/library.model");

const handleUploadInDB = async (req, res) => {
 
  const fileUrl = req.file.path;
  const fileType = req.file.mimetype;
  try {
    await library.uploadMediaInDB(fileUrl, fileType);
    
    const mediafiles = await library.viewMedia();
    // console.log(mediafiles); // Check the media files array in console
    res.render("Library", { mediafiles: mediafiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
};

const viewMedia = async (req, res) => {
  try {
    const mediafiles = await library.viewMedia();
    res.render("Library", { mediafiles: mediafiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing media");
  }
};

module.exports = {
  handleUploadInDB,
  viewMedia,
};
