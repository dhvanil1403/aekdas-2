const screen = require("../models/newScreen.model");
const dotenv = require("dotenv");

dotenv.config();

const addScreen = async (req, res) => {
  const {
    PairingCode,
    ScreenName,
    Tags,
    Location,
    City,
    State,
    Country,
    Area,
  } = req.body;
  try {
    const existingScreen = await screen.screenByPairingCode(PairingCode);
    if (existingScreen.length > 0) {
      const allScreens = await screen.getNotdeletedScreen();
      const screenCount = await screen.getTotalScreenCount();
      const onlineScreen = await screen.getNotDeletedScreenCount();
      const offlineScreen = await screen.getDeletedScreenCount();
      return res.render("Screen", {
        message: "Screen with this Pairing Code already exists",
        screens: allScreens,
        screenCount,
        onlineScreen,
        offlineScreen,
      });
    }

    await screen.newScreen(
      PairingCode,
      ScreenName,
      Tags,
      Location,
      City,
      State,
      Country,
      Area
    );
    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    const offlineScreen = await screen.getDeletedScreenCount();
    const allScreens = await screen.getNotdeletedScreen();
    res.render("Screen", {
      message: "Successfully registered Screen",
      screens: allScreens,
      screenCount,
      onlineScreen,
      offlineScreen,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Add Screen error");
  }
};

const getAllScreens = async (req, res) => {
  try {
    const allScreens = await screen.getAllScreens(); // Fetch all screens
    res.render("Screen", { message: null, screens: allScreens });
  } catch (err) {
    console.error("Error fetching all screens:", err);
    res.status(500).send("Error fetching screens");
  }
};

const getNotdeletedScreen = async (req, res) => {
  try {
    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    const offlineScreen = await screen.getDeletedScreenCount();
    const notDeletedScreen = await screen.getNotdeletedScreen(); // Fetch not deleted screens
    res.render("Screen", {
      message: null,
      screens: notDeletedScreen,
      screenCount,
      onlineScreen,
      offlineScreen,
    });
  } catch (err) {
    console.error("Error fetching NOT deleted screens:", err);
    res.status(500).send("Error fetching NOT deleted screens");
  }
};

const updateDeleteScreen = async (req, res) => {
  const { PairingCode } = req.body;
  try {
    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    const offlineScreen = await screen.getDeletedScreenCount();
    const result = await screen.updateDeleteScreen(PairingCode);
    const notDeletedScreens = await screen.getNotdeletedScreen(); // Fetch updated not deleted screens
    res.render("Screen", {
      message: "Screen deleted successfully",
      screens: notDeletedScreens,
      screenCount,
      onlineScreen,
      offlineScreen,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error UPDATING  deleted screens");
  }
};

const editScreen = async (req, res) => {
  const {
    PairingCode,
    ScreenName,
    Tags,
    Location,
    City,
    State,
    Country,
    Area,
  } = req.body;

  try {
    await screen.editScreen(
      PairingCode,
      ScreenName,
      Tags,
      Location,
      City,
      State,
      Country,
      Area
    );
    const offlineScreen = await screen.getDeletedScreenCount();
  
    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    const notDeletedScreens = await screen.getNotdeletedScreen(); // Fetch updated not deleted screens
    res.render("Screen", {
      message: "Screen edited successfully",
      screens: notDeletedScreens,offlineScreen,screenCount,onlineScreen
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error editing screen");
  }
};

const screenByPairingCode = async (req, res) => {
  const { pairingCode } = req.params;
  try {
    const screenData = await screen.screenByPairingCode(pairingCode);
    if (screenData.length === 0) {
      return res.status(404).json({ message: "Screen not found" });
    }
    res.json(screenData[0]);
  } catch (err) {
    console.error("Error fetching screen:", err);
    res.status(500).send("Error fetching screen");
  }
};


const getDeletedScreens = async (req, res) => {
  try {
    const deletedScreens = await screen.getDeletedScreen(); 
    res.json(deletedScreens);
  } catch (err) {
    console.error('Error fetching deleted screens:', err);
    res.status(500).json({ error: 'Error fetching deleted screens' });
  }
};
const showGroupScreen=async(req,res)=>{ 
  try {
    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    const offlineScreen = await screen.getDeletedScreenCount();
    const allScreens = await screen.getGroupScreen(); 
    // res.render("Screen", { message: null, screens: allScreens,screenCount,onlineScreen,offlineScreen });
    res.json(allScreens);
  } catch (err) {
    console.error("Error fetching all group screens:", err);
    res.status(500).send("Error fetching  group screens");
  }

}
module.exports = {
  addScreen,
  getAllScreens,
  getNotdeletedScreen,
  updateDeleteScreen,
  editScreen,
  screenByPairingCode,
  getDeletedScreens,
  showGroupScreen
};
