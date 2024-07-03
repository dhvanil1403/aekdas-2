const db = require("../config/dbConnection");

const createPlaylist = async (playlistData) => {
    const { screenID, playlistName, playlistDescription, urls } = playlistData;
  
    try {
    //   // Prepare slot columns and values
    console.log("urls",urls);
  console.log("screenID",screenID);
  console.log("playlistName",playlistName);
  console.log("playlistDescription",playlistDescription);
      const values = [screenID, playlistName, playlistDescription, ...urls.slice(0, 10)];
      const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
      const columns = ['screen_id', 'playlistname', 'playlistdescription', ...urls.slice(0, 10).map((_, index) => `slot${index + 1}`)];
  
      // Create SQL query dynamically
      const query = `
        INSERT INTO playlists (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;
      // Execute query and return newly created playlist
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Error creating playlist');
    }
}
module.exports={
    createPlaylist
}