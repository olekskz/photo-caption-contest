'use strict';

const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Caption extends Model {
        static associate(models) {
            Caption.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
            });
            Caption.belongsTo(models.Photo, {
                foreignKey: 'photo_id',
                as: 'photo',
            });
        }
    }
    Caption.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            photo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Caption',
            tableName: 'captions', // Переконайтеся, що ім'я таблиці правильне
            timestamps: true,
        }
    );
    return Caption;
};