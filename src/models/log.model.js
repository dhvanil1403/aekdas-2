const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dbzvtfeophlfnr', 'u3m7grklvtlo6', 'AekAds@24', {
    host: '35.209.89.182',
    dialect: 'postgres'
});

const Log = sequelize.define('Log', {
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

module.exports = { Log };
