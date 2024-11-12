const User = require('./User');
const Tip = require('./Tip');

// Define relationships between models

// User can have many Tips
User.hasMany(Tip, {
    foreignKey: 'user_id', // Column in Tip table that references User
    onDelete: 'CASCADE' // If a user is deleted, delete all their tips
});

// Each Tip belongs to one User
Tip.belongsTo(User, {
    foreignKey: 'user_id' // Column in Tip table that references User
});

module.exports = { User, Tip };
