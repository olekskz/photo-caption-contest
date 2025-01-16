'use strict';

/** @type {import('sequelize-cli').Migration} */
// файл: /path/to/your/migrations/add-likes-to-captions.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('captions', 'likes', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('captions', 'likes');
  }
};