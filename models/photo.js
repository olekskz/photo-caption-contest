const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Photo = sequelize.define('Photo', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        
    }
})