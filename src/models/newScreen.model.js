const db = require("../config/dbConnection");

const newScreen = async (
  PairingCode,
  ScreenName,
  Tags,
  Location,
  City,
  State,
  Country,
  Area
) => {
  try {
    const result = await db.query(
      "INSERT INTO screens (PairingCode,ScreenName,Tags,Location,City,State,Country,Area) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [PairingCode, ScreenName, Tags, Location, City, State, Country, Area]
    );

    return result.rows;
  } catch (err) {
    console.error("error occur at add new Screen in Screen:", err);
    throw err;
  }
};

const screenByPairingCode = async (PairingCode) => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE PairingCode=$1",
      [PairingCode]
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at find SCREEN in SCREEN TABLE:", err);
    throw err;
  }
};

const getAllScreens = async () => {
  try {
    const result = await db.query("SELECT * FROM screens");
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};

const getNotdeletedScreen = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE  deleted = false"
    );
    return result.rows;
  } catch (err) {
    console.error("Error occurred at fetching all screens:", err);
    throw err;
  }
};

const updateDeleteScreen = async (pairingCode) => {
  try {
    const result = await db.query(
      "UPDATE screens SET deleted = true WHERE pairingcode = $1",
      [pairingCode]
    );
 
  } catch (err) {
    console.error("Error updating screen:", err);
    res.status(500).send("Error updating screen");
  }
};

const restoreScreenInDB = async (pairingCode) => {
  try {
    const result = await db.query(
      "UPDATE screens SET deleted = false WHERE pairingcode = $1",
      [pairingCode]
    );
    return result.rows;
  } catch (err) {
    console.error("Error restoring  screen:", err);
    res.status(500).send("Error restoring  screen");
  }
};

const editScreen = async (
  PairingCode,
  ScreenName,
  Tags,
  Location,
  City,
  State,
  Country,
  Area
) => {
  try {
    const result = await db.query(
      "UPDATE screens SET screenname = $2, tags = $3, location = $4, city = $5, state = $6, country = $7, Area = $8 WHERE pairingcode = $1",
      [PairingCode, ScreenName, Tags, Location, City, State, Country, Area]
    );
    return result.rows;
  } catch (err) {
    console.error("Error updating screen:", err);
    throw err;
  }
};

const getTotalScreenCount = async () => {
  try {
    const result = await db.query("SELECT COUNT(*) AS count FROM screens");
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching screen count:", error);
    throw error;
  }
};

const getNotDeletedScreenCount = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM screens WHERE deleted=false"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching not deleted screen count:", error);
    throw error;
  }
};

const getDeletedScreenCount = async () => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS count FROM screens WHERE deleted=true"
    );
    return result.rows[0].count;
  } catch (error) {
    console.error("Error fetching  deleted screen count:", error);
    throw error;
  }
};

const getDeletedScreen = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM screens WHERE deleted = true"
    );
    return result.rows;
  } catch (err) {
    console.error("Error fetching deleted screens:", err);
    throw err;
  }
};

const getGroupScreen=async () => {
try {
  const result = await db.query(
    "SELECT * FROM  groupscreen WHERE deleted=false"
  );
  return result.rows;
} catch (err) {
  console.error("Error occurred at fetching group screens:", err);
  throw err;
}}
module.exports = {
  restoreScreenInDB,
  newScreen,
  screenByPairingCode,
  getAllScreens,
  getNotdeletedScreen,
  updateDeleteScreen,
  editScreen,
  getTotalScreenCount,
  getNotDeletedScreenCount,
  getDeletedScreenCount,
  getDeletedScreen,
  getGroupScreen
};
