const express = require("express");
const router = express.Router();
const upload=require('../middlewares/uploadmedia.middlewares');
const library=require('../controllers/library.controller');
const cloudinary = require("../config/cloudinaryConfig");
router.get("/", (req, res) => {
  res.render("Playlist");
});

router.get("/newPlaylist", library.viewMediaForPlaylist);
router.get("/Photoes", library.getPhotoesForPlaylist);
router.get("/Videos", library.getVideosForPlaylist);
router.post("/UploadFile",upload.single('file'), library.handleUploadInDBForNewPlaylist);
// Endpoint to receive selected items URLs and create and concatenate videos
router.post('/createVideos', async (req, res) => {
  const { items } = req.body; // Array of image URLs received from frontend
  const transformedVideoUrls = [];

  try {
    for (let i = 0; i < items.length; i++) {
      const imageUrl = items[i];
      console.log('Image URL:', imageUrl);

      // Transform image URL to video
      const videoUrl = await transformImageUrlToVideo(imageUrl);
      console.log('Transformed Video URL:', videoUrl);

      transformedVideoUrls.push(videoUrl); // Store transformed video URL
    }

    // Respond with the array of transformed video URLs
    res.json({ message: 'Images transformed to videos successfully.', transformedVideoUrls });
  } catch (error) {
    console.error('Error transforming images to videos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

async function transformImageUrlToVideo(url) {
  try {
    // Extract public ID from the image URL
    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
      throw new Error('Invalid image URL format');
    }

    const transformationResult = await cloudinary.uploader.explicit(publicId, {
      type: 'fetch',
      resource_type: 'image',
      eager: [
        {
          transformation: [
            { effect: "loop:10" }, // Loop the image to create a 10-second video
            { effect: "fade:2000" }, // Add fade effect
            { duration: 10, format: 'mp4' } // Set duration to 10 seconds and convert to video
          ]
        }
      ]
    });

    if (transformationResult && transformationResult.eager && transformationResult.eager.length > 0) {
      return transformationResult.eager[0].secure_url; // Return the secure URL of the transformed video
    } else {
      throw new Error('No transformation result found.');
    }
  } catch (error) {
    console.error('Error transforming image URL to video:', error);
    throw error;
  }
}

// Utility function to extract public ID from Cloudinary URL
// Utility function to extract and decode public ID from Cloudinary URL
function getPublicIdFromUrl(url) {
  try {
    const regex = /\/v\d+\/(.+?)\./; // Adjust the regex pattern to match your Cloudinary URL format
    const match = url.match(regex);
    if (match && match.length > 1) {
      const publicIdEncoded = match[1];
      const publicIdDecoded = decodeURIComponent(publicIdEncoded); // Decode URL-encoded public ID
      return publicIdDecoded;
    }
    return null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    throw error;
  }
}

// router.get("/newPlaylist", (req, res) => {
//   res.render("newPlaylist");
// });
module.exports = router;
