const db = require("../config/dbConnection");

const uploadMediaInDB = async (fileUrl, fileType) => {
  try {
    const result = await db.query(
      "INSERT INTO mediafiles (url,type) VALUES ($1,$2)",
      [fileUrl, fileType]
    );

    return result.rows;
  } catch (err) {
    console.error("Error occur uploading files in database:", err);
    throw err;
  }
};


const viewMedia = async () => {
  try {
    const result = await db.query("SELECT * FROM mediafiles");
    return result.rows;
  } catch (err) {
    console.error("error occur viewing files from database:", err);
    throw err;
  }
};

const getPhotoes=async()=>{
  try {
    const result = await db.query("SELECT * FROM mediafiles WHERE type LIKE 'image/%';");
    return result.rows;
  } catch (err) {
    console.error("error occur viewing  photoes images files from database:", err);
    throw err;
  }
};

const getVideos=async()=>{
  try {
    const result = await db.query("SELECT * FROM mediafiles WHERE type LIKE 'video/%';");
    return result.rows;
  } catch (err) {
    console.error("error occur viewing videos from database:", err);
    throw err;
  }
}

const getmediafileCount = async () => {
  try {
    const result = await db.query("SELECT COUNT(*) AS count FROM mediafiles");
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching screen count:", error);
    throw error;
  }
};
module.exports = {
  uploadMediaInDB,
  viewMedia,
  getPhotoes,
  getVideos,
  getmediafileCount
};
