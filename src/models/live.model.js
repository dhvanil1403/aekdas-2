const db = require("../config/dbConnection");

const showAvailableScreen = async () => {
    const query = `
    SELECT screenid, pairingcode, screenname, status, tags, location, city, area, state, pincode, country, deleted, playlistname, playlistdescription, slot1, slot2, slot3, slot4, slot5, slot6, slot7, slot8, slot9, slot10, name, description, live1, live2, live3, live4, live5, live6, live7, live8, live9, live10
    FROM public.screens;
  `;
    const { rows } = await db.query(query);
    return rows;
};
const showliveData = async () => {
    const query = `
      SELECT *
      FROM public.live ORDER BY id DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
};
const updateScreenWithLive = async (screenID, pairingCode, liveData) => {
    const query = `
    UPDATE public.screens
    SET 
      name = $1,
      description = $2,
      live1 = $3,
      live2 = $4,
      live3 = $5,
      live4 = $6,
      live5 = $7,
      live6 = $8,
      live7 = $9,
      live8 = $10,
      live9 = $11,
      live10 = $12
    WHERE screenid = $13 AND pairingcode = $14;
  `;
    const values = [
        liveData.name,
        liveData.description,
        liveData.live1,
        liveData.live2,
        liveData.live3,
        liveData.live4,
        liveData.live5,
        liveData.live6,
        liveData.live7,
        liveData.live8,
        liveData.live9,
        liveData.live10,
        screenID,
        pairingCode,
    ];
    await db.query(query, values);
};


const createLive = async (liveData) => {
    const query = `
      INSERT INTO public.live (screenid, pairingcode, name, description, live1, live2, live3, live4, live5, live6, live7, live8, live9, live10)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::text[]);
    `;
    const values = [
        liveData.screenID, // Assuming screenID is already an array [301648, 301649, 301651]
        liveData.pairingCode, // Assuming pairingCode is already an array ["Elec_go", "Elec_go", "Elec_go"]
        liveData.name,
        liveData.description,
        liveData.live1,
        liveData.live2,
        liveData.live3,
        liveData.live4,
        liveData.live5,
        liveData.live6,
        liveData.live7,
        liveData.live8,
        liveData.live9,
        liveData.live10,
    ];
    await db.query(query, values);
};


const getScreenIDsByLiveId = async (liveId) => {
    const query = `
      SELECT screenid
      FROM public.live
      WHERE id = $1;
    `;
    const values = [liveId];

    const result = await db.query(query, values);
    return result.rows.map(row => row.screenid);
};

const deleteLiveById = async (liveId) => {
    const query = `
      DELETE FROM public.live
      WHERE id = $1;
    `;
    const values = [liveId];

    const result = await db.query(query, values);
    return result.rows[0];
};

const updateScreensWithLive = async (screenIDs, liveData) => {
    let query = `
      UPDATE public.screens
      SET name = $1,
          description = $2
      WHERE screenid = ANY($3::integer[]);
    `;
    let values = [
      liveData ? liveData.name || null : null,
      liveData ? liveData.description || null : null,
      screenIDs,
    ];
  
    // Append live content updates if liveData exists
    if (liveData) {
      query += `
        UPDATE public.screens
        SET live1 = $4,
            live2 = $5,
            live3 = $6,
            live4 = $7,
            live5 = $8,
            live6 = $9,
            live7 = $10,
            live8 = $11,
            live9 = $12,
            live10 = $13
        WHERE screenid = ANY($14::integer[]);
      `;
      values.push(
        liveData.live1 || null,
        liveData.live2 || null,
        liveData.live3 || null,
        liveData.live4 || null,
        liveData.live5 || null,
        liveData.live6 || null,
        liveData.live7 || null,
        liveData.live8 || null,
        liveData.live9 || null,
        liveData.live10 || null,
        screenIDs
      );
    }
  
    await db.query(query, values);
  };

module.exports = {
    showAvailableScreen,
    updateScreenWithLive,
    createLive, showliveData, getScreenIDsByLiveId, deleteLiveById, updateScreensWithLive
};
