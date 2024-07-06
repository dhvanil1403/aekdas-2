const library = require("../models/library.model");
const cloudinary = require("../config/cloudinaryConfig");

const handleUploadInDB = async (req, res) => {
  if (!req.file) {
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
      const publicId = req.file.filename;
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "video",
        media_metadata: true,
      });
      // console.log(result);
      duration = result.duration ? Math.ceil(result.duration) : 0; // Round duration up to the nearest whole number
      console.log("Duration:", result.duration); // Duration in seconds
    } catch (err) {
      console.error("Error fetching video duration from Cloudinary:", err);
      duration = 0; // Default duration in case of an error
    }
  }
  const fileSizeBytes = req.file.size;
  const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
  console.log("fileUrl", fileUrl);
  console.log("fileType", fileType);
  console.log("fileName", fileName);
  console.log("duration", duration);
  console.log("fileSizeBytes", fileSizeBytes);

  console.log("fileSizeMB", fileSizeMB);
  try {
    // await library.uploadMediaInDB(fileUrl, fileType,fileName,duration,fileSizeMB);
    if (fileType.startsWith("video/")) {
      // Include duration for videos
      await library.uploadMediaInDB(
        fileUrl,
        fileType,
        fileName,
        duration,
        fileSizeMB
      );
    } else {
      // Exclude duration for images
      await library.uploadMediaInDB(
        fileUrl,
        fileType,
        fileName,
        null,
        fileSizeMB
      );
    }
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
  if (!req.file) {
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
      const publicId = req.file.filename;
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "video",
        media_metadata: true,
      });
      // console.log(result);
      duration = result.duration ? Math.ceil(result.duration) : 0; // Round duration up to the nearest whole number
      console.log("Duration:", result.duration); // Duration in seconds
    } catch (err) {
      console.error("Error fetching video duration from Cloudinary:", err);
      duration = 0; // Default duration in case of an error
    }
  }
  const fileSizeBytes = req.file.size;
  const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
  // console.log("fileUrl", fileUrl);  console.log("fileSizeMB", fileSizeMB);console.log("fileType", fileType);console.log("fileName", fileName);console.log("duration", duration);console.log("fileSizeBytes", fileSizeBytes);

  try {
    
    if (fileType.startsWith("video/")) {
      // Include duration for videos
      await library.uploadMediaInDB(
        fileUrl,
        fileType,
        fileName,
        duration,
        fileSizeMB
      );
    } else {
      // Exclude duration for images
      await library.uploadMediaInDB(
        fileUrl,
        fileType,
        fileName,
        null,
        fileSizeMB
      );
    }
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
const viewMediaForPlaylist = async (req, res) => {
  try {
    const mediafiles = await library.viewMedia();
    const convertedMediaFiles = mediafiles.map(file => {
      const durationString = intervalToString(file.duration);
      // console.log(durationString);
      return { ...file, durationString };
    });
    res.render("newPlaylist", { mediafiles: convertedMediaFiles });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error viewing media for Playlist");
  }
};
function intervalToString(interval) {
  const hours = interval.hours ? `${interval.hours}h ` : '';
  const minutes = interval.minutes ? `${interval.minutes}m ` : '';
  const seconds = interval.seconds ? `${interval.seconds} sec` : '';
  return `${hours}${minutes}${seconds}`.trim();
}
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
  getPhotoesForPlaylist,
  getVideosForPlaylist,
  handleUploadInDBForNewPlaylist,
  intervalToString
};
