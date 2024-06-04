const groupScreen = require("../models/groupScreen.model");
const dotenv = require("dotenv");

dotenv.config();

const createGroup = async (req, res) => {
  const { groupName, description ,screenCount } = req.body;
  
  try {
    await groupScreen.createGroup(groupName, description,screenCount );
    res.redirect("/Dashboard/Screens");
  } catch (err) {
    console.error(err);
    res.status(500).send("create group ERROR");
  }
};

const showAvailableScreen=async (req,res)=>{
   const screens= await groupScreen.showAvailableScreen();
    res.render("groupScreen",{screens});
}
module.exports={
    createGroup,
    showAvailableScreen
}