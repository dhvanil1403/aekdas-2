
const playlists = require("../models/playlists.model");
const groupScreen = require("../models/groupScreen.model");
const library = require("../models/library.model");
const { json } = require("express");

const createPlaylist = async (req, res) => {
  try {
    const { urls, screenIDs, playlistName, playlistDescription } = req.body;
    // console.log("urls", urls);
    // console.log("screenID", screenIDs);
    // console.log("playlistName", playlistName);
    // console.log("playlistDescription", playlistDescription);
    // Create playlist object
    const playlistData = {
      screenIDs,
      playlistName,
      playlistDescription,
      urls,
    };

    // Call model function to save playlist
     const newPlaylist = await playlists.createPlaylist(playlistData);
     await playlists.updateScreensWithPlaylist(screenIDs, playlistName, playlistDescription, urls);
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

const showAvailableScreen = async (req, res) => {
  const { groupName } = req.params;
  let group = null;
  if (groupName) {
    group = await groupScreen.getGroupByGroupName(groupName);
  }

  const screens = await groupScreen.showAvailableScreen();
  res.render("selectionNewPlaylist", { screens,group});
};
const showAvailableScreenForEditPlaylist = async (req, res) => {
  
  const playlistsAll = await playlists.viewPlaylist();
  console.log("playlist all",playlistsAll);

  const screens = await groupScreen.showAvailableScreen();
  res.render("EditselectionPlaylist", { screens,playlistsAll});
};
const getPlaylistById = async(req, res) => {
  const playlistId = req.params.playlistId;
  try {
    const playlist = await playlists.getPlaylistById(playlistId);
    // console.log('Fetched playlist:', playlist);
    const mediafiles = await library.viewMedia();
    const convertedMediaFiles = mediafiles.map(file => {
      const durationString = intervalToString(file.duration);
      // console.log(durationString);
      return { ...file, durationString };
    });
    // console.log('Converted media files:', convertedMediaFiles);
    res.render('newEditPlaylist', { playlist,mediafiles: convertedMediaFiles});
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).send('Internal Server Error');
  }
}

function intervalToString(interval) {
  const hours = interval.hours ? `${interval.hours}h ` : '';
  const minutes = interval.minutes ? `${interval.minutes}m ` : '';
  const seconds = interval.seconds ? `${interval.seconds} sec` : '';
  return `${hours}${minutes}${seconds}`.trim();
}

const editPlaylist = async (req, res) => {
  try {
    const { playlistId,urls, screenIDs, playlistName, playlistDescription } = req.body;

    // Create playlist object
    const playlistData = {
      playlistId,
      screenIDs,
      playlistName,
      playlistDescription,
      urls,
    };

    // Call model function to update playlist
    const updatedPlaylist = await playlists.editPlaylist(playlistData);

    // Update screens with the new playlist
    await playlists.updateScreensWithPlaylist(screenIDs, playlistName, playlistDescription, urls);

    console.log("Playlist updated");

    // Respond with the updated playlist
    res.status(200).json({
      message: "Playlist updated successfully",
      playlist: updatedPlaylist,
    });
  } catch (err) {
    console.error("Error updating playlist:", err);
    res.status(500).json({ error: "Failed to update playlist" });
  }
};

// const deletePlaylist = async (req, res) => {
//   try {
//     const { playlistId,urls, screenIDs, playlistName, playlistDescription } = req.body;

//     // Create playlist object
//     const playlistData = {
//       playlistId,
//       screenIDs:null,
//       playlistName:null,
//       playlistDescription:null,
//       urls:null,
//     };

//     // Call model function to update playlist
//     const updatedPlaylist = await playlists.deletePlaylist(playlistData);

//     // Update screens with the new playlist
//     await playlists.deleteScreensWithPlaylist(playlistData);

//     console.log("Playlist updated");

//     // Respond with the updated playlist
//     res.status(200).json({
//       message: "Playlist deleted successfully",
//       playlist: updatedPlaylist,
//     });
//   } catch (err) {
//     console.error("Error deleted playlist:", err);
//     res.status(500).json({ error: "Failed to deleted playlist" });
//   }
// };



























































// const deletePlaylist = async (req, res) => {
//   try {
//     const { playlistId } = req.params;
//     const screenIDs = await playlists.getScreenIDsByPlaylistId(playlistId);

//     // Update screens to remove playlist associations
//     await playlists.deleteScreensWithPlaylist(screenIDs);

//     // Remove playlist from database
//     const deletedPlaylist = await playlists.deletePlaylistById(playlistId);

//     // Respond with the deleted playlist
//     res.status(200).json({
//       message: "Playlist deleted successfully",
//       playlist: deletedPlaylist,
//     });
//   } catch (err) {
//     console.error("Error deleting playlist:", err);
//     res.status(500).json({ error: "Failed to delete playlist" });
//   }
// };

// module.exports = {
//   deletePlaylist,
// };




























































const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Log the playlistId to ensure it's received correctly
    console.log("Playlist ID:", playlistId);

    // Fetch the screen IDs associated with the playlist
    const screenIDs = await playlists.getScreenIDsByPlaylistId(playlistId);

    // Log the screen IDs to debug the returned result
    console.log("Screen IDs:", screenIDs);

    // Update screens to remove playlist associations
    await playlists.deleteScreensWithPlaylist(screenIDs);
    console.log("Screens updated successfully");

    // Remove playlist from the database
    const deletedPlaylist = await playlists.deletePlaylistById(playlistId);

    // Log the deleted playlist to ensure it's deleted correctly
    console.log("Deleted Playlist:", deletedPlaylist);

    // Respond with the deleted playlist
    res.redirect('/Dashboard/Playlist');
  } catch (err) {
    console.error("Error deleting playlist:", err);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};















module.exports = { createPlaylist ,showPlaylist,showAvailableScreen,getPlaylistById,showAvailableScreenForEditPlaylist,editPlaylist,deletePlaylist};
