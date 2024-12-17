'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false, // Обов'язкове поле
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false, // Обов'язкове поле
            unique: true, // Унікальне значення
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false, // Обов'язкове поле
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        });    
  },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('users');
    }
};
