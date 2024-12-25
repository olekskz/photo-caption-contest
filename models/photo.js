'use strict';


const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Photo extends Model {
        static associate(models) {
            Photo.belongsTo(models.User, {
                foreignKey: 'user_id', // Вказуємо явно 'user_id'
                as: 'user',  // Це псевдонім для асоціації, що можна використовувати для доступу до користувача
            });
        }
    }
    Photo.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Photo',
            tableName: 'photos',
            timestamps: true,
        }
    );
    return Photo;
};
