const sequelize = require('../config/connection');
const { User, Tip } = require('../models');

const userData = {
    username: 'mra24',
    email: 'mra24@me.com',
    password: 'password123'
};

const tipData = [
    {
        amount: 150.00,
        shift_date: '2024-03-15',
        shift_type: 'Night',
        hours_worked: 8,
        notes: 'Busy Friday night'
    },
    {
        amount: 120.00,
        shift_date: '2024-03-16',
        shift_type: 'Day',
        hours_worked: 6,
        notes: 'Saturday afternoon shift'
    }
    // Add more seed data as needed
];

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    // Create user
    const user = await User.create(userData);

    // Create tips associated with user
    for (const tip of tipData) {
        await Tip.create({
            ...tip,
            user_id: user.id
        });
    }

    process.exit(0);
};

seedDatabase(); 