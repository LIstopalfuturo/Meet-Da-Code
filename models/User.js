const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// Create User model by extending Sequelize's Model class
class User extends Model {
    // Method to check password validity
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// Initialize User model with its attributes and options
User.init(
    {
        // Define model attributes
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Username must be unique
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true, // Validates email format
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8], // Password must be at least 8 characters
            },
        },
    },
    {
        // Model options
        hooks: {
            // Before creating a new user, hash their password
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
        },
        sequelize, // Pass the database connection
        timestamps: true, // Adds createdAt and updatedAt timestamps
        freezeTableName: true, // Prevent Sequelize from pluralizing table name
        underscored: true, // Use snake_case rather than camelCase
        modelName: 'user', // Set model name
    }
);

module.exports = User;
