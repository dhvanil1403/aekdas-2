const playlists = require("../models/playlists.model");

const createPlaylist = async (req, res) => {
  try {
    const { urls, screenID, playlistName, playlistDescription } = req.body;
    console.log("urls", urls);
    console.log("screenID", screenID);
    console.log("playlistName", playlistName);
    console.log("playlistDescription", playlistDescription);
    // Create playlist object
    const playlistData = {
      screenID,
      playlistName,
      playlistDescription,
      urls,
    };

    // Call model function to save playlist
    const newPlaylist = await playlists.createPlaylist(playlistData);
    console.log("newplaylist created");
    // Respond with the newly created playlist
    res
      .status(201)
      .json({
        message: "Playlist created successfully",
        playlist: newPlaylist,
      });
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

const showPlaylist=async(req,res)=>{
  try {
    const playlistsData=await playlists.viewPlaylist();
    res.render('Playlist',{playlists:playlistsData})
  } catch (error) {
    console.error("Controller showPlaylist error", error);
    res.status(500).send("Error retrieving playlists");
  }
}

module.exports = { createPlaylist ,showPlaylist};
