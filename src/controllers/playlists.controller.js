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

module.exports = { createPlaylist ,showPlaylist,showAvailableScreen,getPlaylistById,showAvailableScreenForEditPlaylist};