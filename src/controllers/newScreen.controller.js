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
    if (PairingCode.length > 6) {
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

    const existingScreen = await screen.screenByPairingCode(PairingCode);
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
    const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
    const groupscreen = await screen.getGroupScreen();

    res.render("Screen", {
      message: null,
      screens: notDeletedScreen,
      screenCount,
      onlineScreen,
      offlineScreen,
      deletedScreens,
      groupscreen,
    });
  } catch (err) {
    console.error("Error fetching screens:", err);
    res.status(500).send("Error fetching screens");
  }
};

const updateDeleteScreen = async (req, res) => {
  const { pairingCode } = req.body;

  try {
    await screen.updateDeleteScreen(pairingCode);
    res.sendStatus(204); // No Content status code indicates successful deletion
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting screen");
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
    const deletedScreens = await screen.getDeletedScreen(); // Fetch deleted screens
    const groupscreen = await screen.getGroupScreen();

    const screenCount = await screen.getTotalScreenCount();
    const onlineScreen = await screen.getNotDeletedScreenCount();
    const notDeletedScreens = await screen.getNotdeletedScreen(); // Fetch updated not deleted screens
    res.render("Screen", {
      message: "Screen edited successfully",
      screens: notDeletedScreens,
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
  } catch (err) {
    console.error("Error fetching screen:", err);
    res.status(500).send("Error fetching screen");
  }
};

// const getDeletedScreens = async (req, res) => {
//   try {
//     const deletedScreens = await screen.getDeletedScreen();
//     res.json(deletedScreens);
//   } catch (err) {
//     console.error('Error fetching deleted screens:', err);
//     res.status(500).json({ error: 'Error fetching deleted screens' });
//   }
// };
// const showGroupScreen = async (req, res) => {
//   try {
//     const screenCount = await screen.getTotalScreenCount();
//     const onlineScreen = await screen.getNotDeletedScreenCount();
//     const offlineScreen = await screen.getDeletedScreenCount();
//     const allScreens = await screen.getGroupScreen();
//     // res.render("Screen", { message: null, screens: allScreens,screenCount,onlineScreen,offlineScreen });
//     res.json(allScreens);
//   } catch (err) {
//     console.error("Error fetching all group screens:", err);
//     res.status(500).send("Error fetching  group screens");
//   }
// };

const restoreScreen = async (req, res) => {
  const { PairingCode } = req.body;
  try {
    const restoredScreen = await screen.restoreScreenInDB(PairingCode);
    res.json({ success: true, screen: restoredScreen });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error restoring screen" });
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
};
