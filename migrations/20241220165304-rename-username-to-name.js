'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Перейменування колонки 'name' на 'username'
    await queryInterface.renameColumn('users', 'name', 'username');
  },

  down: async (queryInterface, Sequelize) => {
    // Повернення зміни назад, з 'username' на 'name'
    await queryInterface.renameColumn('users', 'username', 'name');
  }
};