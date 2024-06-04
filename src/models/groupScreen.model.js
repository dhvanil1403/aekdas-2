const db = require("../db/dbConnection");


const createGroup=async (
    groupName,description,screenCount 
  ) => {
    try {
      const result = await db.query(
        "INSERT INTO groupscreen (group_name,group_description,total_screen) VALUES ($1,$2,$3)",
        [groupName, description,screenCount ]
      );
      return result.rows[0];
    } catch (err) {
      console.error("error occur at creating new group  in Screen:", err);
      throw err;
    }
};

const showAvailableScreen=async () => {
    try {
      const result = await db.query(
        "SELECT screenname, tags, location, deleted FROM screens WHERE deleted = false"
      );
      return result.rows;
    } catch (err) {
      console.error("Error occurred at fetching all screens:", err);
      throw err;
    }
  };
module.exports={
    createGroup,
    showAvailableScreen
}