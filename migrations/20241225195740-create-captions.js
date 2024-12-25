'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('captions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false, // Обов'язковий текст підпису
      },
      photo_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Фото, до якого належить підпис
        references: {
          model: 'photos', // Таблиця фотографій, на яку посилається це поле
          key: 'id', // Поле, яке є зовнішнім ключем
        },
        onDelete: 'CASCADE', // Видалити підписи, якщо фото видалене
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Користувач, який створив підпис
        references: {
          model: 'users', // Таблиця користувачів
          key: 'id', // Поле, яке є зовнішнім ключем
        },
        onDelete: 'CASCADE', // Видалити підписи, якщо користувач видалений
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('captions');
  }
};
