'use strict';

const { Model, Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Photo extends Model {
        static associate(models) {
            // Вказуємо зв'язок між Фото та User через зовнішній ключ
            Photo.belongsTo(models.User, {
                foreignKey: 'user_id', // Вказуємо зовнішній ключ
                as: 'user', // Можна використовувати псевдонім для асоціації
            });
        }
    }

    Photo.init(
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          url: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          user_id: { // Додано поле для зовнішнього ключа
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'users', // Вказуємо на таблицю користувачів
              key: 'id' // Зв'язок з полем 'id' таблиці 'users'
            },
            onDelete: 'CASCADE', // Якщо користувач видалений, видаляються і фотографії
          },
        },
        {
            sequelize,
            modelName: 'Photo',
            tableName: 'photos',
            timestamps: true, // Додаються поля createdAt і updatedAt
        }
    );
    return Photo;
};
