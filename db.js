const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('photo contest', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;