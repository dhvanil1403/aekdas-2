const db = require("../config/dbConnection");

const createPlaylist = async (playlistData) => {
  const { screenIDs, playlistName, playlistDescription, urls } = playlistData;
  // console.log("urls", urls);
  //   console.log("screenID", screenIDs);
  //   console.log("playlistName", playlistName);
  //   console.log("playlistDescription", playlistDescription);
  try {
    // Insert into playlists table
    const query = `
      INSERT INTO playlists (screen_id, playlistname, playlistdescription, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9, slot10)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    const values = [
      screenIDs,
      playlistName,
      playlistDescription,
      urls[0] || null,
      urls[1] || null,
      urls[2] || null,
      urls[3] || null,
      urls[4] || null,
      urls[5] || null,
      urls[6] || null,
      urls[7] || null,
      urls[8] || null,
      urls[9] || null,
    ];

    // Execute query and return newly created playlist
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error('Error creating playlist');
  }
};

const viewPlaylist=async()=>{
  try {
    const result=await db.query('SELECT * FROM playlists')
    return result.rows;
  } catch (error) {
    throw new Error('Error show playlist');
  }
}


const updateScreensWithPlaylist = async (screenIDs, playlistName, playlistDescription, urls) => {
  try {
    
    const updatePromises = screenIDs.map(async (screenID, index) => {
      const query = `
        UPDATE screens
        SET 
          playlistname = $1,
          playlistdescription = $2,
          slot1 = $3,
          slot2 = $4,
          slot3 = $5,
          slot4 = $6,
          slot5 = $7,
          slot6 = $8,
          slot7 = $9,
          slot8 = $10,
          slot9 = $11,
          slot10 = $12
        WHERE id = $13
      `;
      const values = [
        playlistName,
        playlistDescription,
        urls[0] || null,
        urls[1] || null,
        urls[2] || null,
        urls[3] || null,
        urls[4] || null,
        urls[5] || null,
        urls[6] || null,
        urls[7] || null,
        urls[8] || null,
        urls[9] || null,
        screenID,
      ];

      await db.query(query, values);
    });

    await Promise.all(updatePromises);
  
  } catch (error) {
    console.error("Error updating screens with playlist:", error);
    throw new Error("Failed to update screens with playlist");
  }
};
const getPlaylistById = async (playlistId) => {
  try {
    const result = await db.query('SELECT * FROM playlists WHERE id = $1', [playlistId]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error fetching playlist');
  }
};
module.exports={
    createPlaylist,viewPlaylist,updateScreensWithPlaylist,getPlaylistById
}