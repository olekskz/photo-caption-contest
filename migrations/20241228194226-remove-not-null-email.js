'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true, // Зробимо поле необов'язковим
      unique: true,
      validate: {
        isEmail: true,
      },
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true, // Зробимо поле необов'язковим
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn('users', 'githubId');
  },
};