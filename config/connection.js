const Sequelize = require('sequelize');
require('dotenv').config();
let sequelize;
console.log(process.env.DB_URL)
if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Helps prevent SSL certificate validation issues
      }
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
      port:'5432'
    }
  );
}
module.exports = sequelize;
// Create connection to database

