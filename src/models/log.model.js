const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('dbzvtfeophlfnr', 'u3m7grklvtlo6', 'AekAds@24', {
    host: '35.209.89.182',
    dialect: 'postgres'
});

const Log = sequelize.define('Log', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'logs' // Adjust according to your actual table name
});

module.exports = { Log };