const sequelize = require('../config/connection');
const { User, Tip } = require('../models');

const userData = require('./userData.json');
const tipData = require('./tipData.json');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    // Create users
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    // Create tips
    for (const tip of tipData) {
      await Tip.create({
                user_id: users[Math.floor(Math.random() * users.length)].id,
      });
    }

    console.log('Database seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase(); 


