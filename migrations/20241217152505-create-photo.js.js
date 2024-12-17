'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('photos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: { // Зовнішній ключ для користувача
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Вказуємо на таблицю користувачів
          key: 'id', // Зв'язок з полем id у таблиці users
        },
        onDelete: 'CASCADE', // Якщо користувача видалено, видаляються і його фотографії
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('photos');
  }
};
