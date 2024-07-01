const library = require("../models/library.model");
const cloudinary = require("../config/cloudinaryConfig");

const handleUploadInDB = async (req, res) => {
  if(!req.file){
    return res.status(400).send("No file uploded");
  }
  console.log(req.file);
  const fileUrl = req.file.path;
  const fileType = req.file.mimetype;
  const fileName = req.file.originalname;
  let duration;
  if (fileType.startsWith("video/")) {
    try {
      // Fetch duration from Cloudinary metadata
      const publicId = req.file.filename; // Assuming this is the correct way to get the public ID in Cloudinary
      const result = await cloudinary.api.resource(publicId, { resource_type: "video" });
      console.log(result);
      console.log('Duration:', result.duration); // Duration in seconds
     // duration = result.duration || 0; // Assign duration if available, otherwise default to 0
    } catch (err) {
      console.error("Error fetching video duration from Cloudinary:", err);
      duration = 0; // Default duration in case of an error
    }
  }
  const fileSizeBytes = req.file.size;
  const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
console.log("fileUrl",fileUrl);
console.log("fileType",fileType);
console.log("fileName",fileName);
console.log("duration",duration);
console.log("fileSizeBytes",fileSizeBytes);

console.log("fileSizeMB",fileSizeMB);
  try {
    // await library.uploadMediaInDB(fileUrl, fileType,fileName,duration,fileSizeMB);
    // if (fileType.startsWith("video/")) {
    //   // Include duration for videos
    //   await library.uploadMediaInDB(fileUrl, fileType, fileName, duration, fileSizeMB);
    // } else {
    //   // Exclude duration for images
    //   await library.uploadMediaInDB(fileUrl, fileType, fileName, null,fileSizeMB);
    // }
    const mediafiles = await library.viewMedia();
    const fileCount = await library.getmediafileCount();
    // console.log(mediafiles); // Check the media files array in console
    res.render("Library", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
};


const handleUploadInDBForNewPlaylist = async (req, res) => {
  if(!req.file){
    return res.status(400).send("No file uploded");
  }
  const fileUrl = req.file.path;
  const fileType = req.file.mimetype;
  try {
    await library.uploadMediaInDB(fileUrl, fileType);

    const mediafiles = await library.viewMedia();
    const fileCount = await library.getmediafileCount();
    // console.log(mediafiles); // Check the media files array in console
    res.render("newPlaylist", { mediafiles: mediafiles, fileCount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file for newplaylist");
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
const viewMediaForPlaylist = async (req, res) => {
  try {
    const mediafiles = await library.viewMedia();
    res.render("newPlaylist",{ mediafiles: mediafiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing media for Playlist");
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
const getPhotoesForPlaylist = async (req, res) => {
  try {
    const mediafiles = await library.getPhotoes();
    // const fileCount = await library.getmediafileCount();
    res.render("newPlaylist", { mediafiles: mediafiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing Photoes for playlist");
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
const getVideosForPlaylist = async (req, res) => {
  try {
    const mediafiles = await library.getVideos();
    // const fileCount = await library.getmediafileCount();
    res.render("newPlaylist", { mediafiles: mediafiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing video media for Playlist");
  }
};

module.exports = {
  handleUploadInDB,
  viewMedia,
  getPhotoes,
  getVideos,
  viewMediaForPlaylist,
  getPhotoesForPlaylist,getVideosForPlaylist,handleUploadInDBForNewPlaylist
};
