const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create Tip model by extending Sequelize's Model class
class Tip extends Model {}

// Initialize Tip model with its attributes and options
Tip.init(
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2), // Allows for amounts up to 99,999,999.99
            allowNull: false,
            validate: {
                isDecimal: true, // Ensures value is a decimal number
            },
        },
        shift_type: {
            type: DataTypes.ENUM('day', 'night'), // Only allows 'day' or 'night' values
            allowNull: false,
        },
        shift_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        hours_worked: {
            type: DataTypes.DECIMAL(4, 2), // Allows for hours like 12.50
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT, // Allows for longer text entries
            allowNull: true, // Notes are optional
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user', // References the User model
                key: 'id', // References the id column in User model
            },
        },
    },
    {
        sequelize,
        timestamps: true, // Adds createdAt and updatedAt timestamps
        freezeTableName: true, // Prevent Sequelize from pluralizing table name
        underscored: true, // Use snake_case rather than camelCase
        modelName: 'tip', // Set model name
    }
);

module.exports = Tip; 