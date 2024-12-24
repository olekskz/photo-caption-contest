'use strict';

const {Model, Sequelize, DataTypes } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
    class Caption extends Model {
        static associate(models) {
            Caption.belongsTo(models.Photo, {
                foreignKey: 'photo_id',
                as: 'photo'
            });
            Caption.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            })
        }
    }
    Caption.init({
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        photo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Caption',
        timestamps: true,
    });
    return Caption;
}