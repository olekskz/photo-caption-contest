'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Photo, {
                foreignKey: 'user_id', // Вказуємо явно 'user_id'
                as: 'photos',  // Це псевдонім для асоціації, що можна використовувати для доступу до фотографій
            });
            
            User.hasMany(models.Caption, {
                foreignKey: 'user_id',
                as: 'captions'
            });
        }
    }
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
        }
    );
    return User;
};