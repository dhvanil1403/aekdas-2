const { json } = require("express");
const screen = require("../models/newScreen.model");
const dotenv = require("dotenv");

dotenv.config();

const addScreen = async (req, res) => {
  const {
    pairingCode,
    screenName,
    tags,
    location,
    city,
    state,
    country,
    pincode,
  } = req.body;
  try {
    if (pairingCode.length > 6) {
      return res.render("Screen", {
        message:
          "Your pairing code is incorrect. It must be 6 characters or less.",
        screens: [],
        screenCount: 0,
        onlineScreen: 0,
        offlineScreen: 0,
        groupscreen: 0,
        deletedScreens: 0,
      });
    }

    const existingScreen = await screen.screenByPairingCode(pairingCode);
    if (existingScreen.length > 0) {
      const allScreens = await screen.getNotdeletedScreen();
      const screenCount = await screen.getTotalScreenCount();
      const onlineScreen = await screen.getNotDeletedScreenCount();
      const offlineScreen = await screen.getDeletedScreenCount();
      const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
      const groupscreen = await screen.getGroupScreen();

      return res.render("Screen", {
        message: "Screen with this Pairing Code already exists",
        screens: allScreens,
        screenCount,
        onlineScreen,
        offlineScreen,
        deletedScreens,
        groupscreen,
      });
    }

    await screen.newScreen(
      pairingCode,
      screenName,
      tags,
      location,
      city,
      state,
      country,
      pincode
    );
    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    const offlineScreen = await screen.getDeletedScreenCount();
    // const allScreens = await screen.getAllScreens();
    const allScreens = await screen.getNotdeletedScreen();

    const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
    const groupscreen = await screen.getGroupScreen();

    res.render("Screen", {
      message: "Successfully registered Screen",
      screens: allScreens,
      screenCount,
      onlineScreen,
      offlineScreen,
      deletedScreens,
      groupscreen,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Add Screen error");
  }
};

const getAllScreens = async (req, res) => {
  try {
    // const allScreens = await screen.getAllScreens(); // Fetch all screens
    const allScreens = await screen.getNotdeletedScreen();

    const onlineScreen = await screen.getNotDeletedScreenCount();
    const screenCount = await screen.getTotalScreenCount();
    const offlineScreen = await screen.getDeletedScreenCount();
    const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
    const groupscreen = await screen.getGroupScreen();
    res.render("Screen", {
      message: null,
      screens: allScreens,
      screenCount,
      onlineScreen,
      offlineScreen,deletedScreens,
      groupscreen,
    });
  } catch (error) {
    console.error("Error fetching all screens:", error);
    res.status(500).send("Error fetching screens");
  }
};

const getAllScreensAllData = async (req, res) => {
  try {
    const allScreens = await screen.getAllScreens(); // Assuming this function fetches all screens

    // Assuming you want to send allScreens as JSON
    res.json(allScreens);
  } catch (error) {
    console.error("Error fetching all screens:", error);
    res.status(500).send("Error fetching screens");
  }
};



const getNotdeletedScreen = async (req, res) => {
  try {
    const notDeletedScreen = await screen.getNotdeletedScreen(); // Fetch not deleted screens

    res.render("Screen", {
      message: null,
      screens: notDeletedScreen,
    });
  } catch (error) {
    console.error("Error fetching screens:", error);
    res.status(500).send("Error fetching screens");
  }
};

const updateDeleteScreen = async (req, res) => {
  const { pairingCode } = req.body;

  try {
    await screen.updateDeleteScreen(pairingCode);
    res.sendStatus(204); // No Content status code indicates successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting screen");
  }
};

const editScreen = async (req, res) => {
  const {
    pairingCode,
    screenName,
    tags,
    location,
    city,
    state,
    country,
    pincode,
  } = req.body;

  try {
    await screen.editScreen(
      pairingCode,
      screenName,
      tags,
      location,
      city,
      state,
      country,
      pincode
    );
    const offlineScreen = await screen.getDeletedScreenCount();
    const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
    const groupscreen = await screen.getGroupScreen();

    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    // const allScreens = await screen.getAllScreens(); // Fetch updated not deleted screens
    const allScreens = await screen.getNotdeletedScreen();

    res.render("Screen", {
      message: "Screen edited successfully",
      screens: allScreens,
      offlineScreen,
      screenCount,
      onlineScreen,
      deletedScreens,
      groupscreen,
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
  } catch (error) {
    console.error("Error fetching screen:", error);
    res.status(500).send("Error fetching screen");
  }
};



const restoreScreen = async (req, res) => {
  const { pairingCode } = req.body;
  try {
    const restoredScreen = await screen.restoreScreenInDB(pairingCode);
    res.json({ success: true, screen: restoredScreen });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error restoring screen" });
  }
};

const deletePlaylist = async (req, res) => {
  const { screenid } = req.params;
console.log("screenid",screenid);
  try {
  const response= await screen.deletePlaylist(screenid);

    res.json(response);
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};
module.exports = {
  addScreen,
  getAllScreens,
  getNotdeletedScreen,
  updateDeleteScreen,
  editScreen,
  screenByPairingCode,
  // getDeletedScreens,
  // showGroupScreen,
  restoreScreen,
  getAllScreensAllData,
  deletePlaylist
};
