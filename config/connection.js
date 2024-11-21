const Sequelize = require('sequelize');
require('dotenv').config();
<<<<<<< HEAD

let sequelize;

if (process.env.DATABASE_URL) {
  // Production database connection
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
=======
let sequelize;
console.log(process.env.DB_URL)
if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Helps prevent SSL certificate validation issues
>>>>>>> a225f3df54df04665c615127a826ed8f5bc54485
      }
    }
  });
} else {
<<<<<<< HEAD
  // Local database connection
=======
>>>>>>> a225f3df54df04665c615127a826ed8f5bc54485
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'postgres',
<<<<<<< HEAD
      port: 5432,
      logging: false
    }
  );
}

=======
      port:'5432'
    }
  );
}
>>>>>>> a225f3df54df04665c615127a826ed8f5bc54485
module.exports = sequelize;
// Create connection to database

