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
module.exports = {
  uploadMediaInDB,
  viewMedia
};
