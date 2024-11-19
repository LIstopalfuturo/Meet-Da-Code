const sequelize = require('../config/connection');
const { User, Tip } = require('../models');

// User seed data
const userData = [
    {
        username: 'mra24',
        email: 'mra24@me.com',
        password: 'password123'
    },
    {
        username: 'bjacsel21',
        email: 'bjacsel21@gmail.com',
        password: 'password123'
    }
];

// Tip seed data
const tipData = [
    // Tips for first user (mra24)
    {
        amount: 150.00,
        shift_date: '2024-11-15',
        shift_type: 'night',
        hours_worked: 8,
        notes: 'Busy Friday night'
    },
    {
        amount: 120.00,

        shift_date: '2024-11-16',
        shift_type: 'day',
        hours_worked: 6,
        notes: 'Saturday afternoon shift'
    },
    {
        amount: 175.50,

        shift_date: '2024-11-17',

        shift_type: 'night',
        hours_worked: 7.5,
        notes: 'Live music night, great turnout'
    },
    {
        amount: 95.00,

        shift_date: '2024-11-18',

        shift_type: 'day',
        hours_worked: 5,
        notes: 'Regular Thursday lunch'
    },
    {
        amount: 210.00,

        shift_date: '2024-11-19',
        shift_type: 'night',
        hours_worked: 9,
        notes: 'Weekend rush, full house'
    },
    // Tips for second user (bjacsel21)
    {
        amount: 165.75,

        shift_date: '2024-11-20',
        shift_type: 'night',
        hours_worked: 8,
        notes: 'Saturday night, busy bar'
    },
    {
        amount: 120.25,

        shift_date: '2024-11-21',
        shift_type: 'day',
        hours_worked: 7,
        notes: 'Sunday brunch shift'
    },
    {
        amount: 78.50,

        shift_date: '2024-11-22',
        shift_type: 'day',
        hours_worked: 5.5,
        notes: 'Slow Monday lunch'
    }
];
const seedDatabase = async () => {
    try {
        // Sync and clear the database
        await sequelize.sync({ force: true });
        // Create all users
        const users = await User.bulkCreate(userData, {
            individualHooks: true, // This ensures password hashing hooks are run
        });
        // Distribute tips between users
        const tipPromises = tipData.map((tip, index) => {
            // Assign first 5 tips to first user, rest to second user
            const userId = index < 5 ? users[0].id : users[1].id;
            return Tip.create({
                ...tip,
                user_id: userId
            });
        });
        await Promise.all(tipPromises);
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }

};
seedDatabase(); 