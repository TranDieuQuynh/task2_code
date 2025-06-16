const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log('Attempting to connect to database with:');
      console.log(`  Host: ${process.env.POSTGRES_HOST}`);
      console.log(`  Port: ${process.env.POSTGRES_PORT}`);
      console.log(`  User: ${process.env.POSTGRES_USER}`);
      console.log(`  DB Name: ${process.env.POSTGRES_DB}`);
      await sequelize.authenticate();
      console.log('Database connected successfully');
      
      // Sync all models
      await sequelize.sync({ alter: true });
      console.log('All models were synchronized successfully');
      return; // Exit loop if connection is successful
    } catch (error) {
      console.error(`Attempt ${i + 1} failed: Unable to connect to the database:`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('All retry attempts failed. Exiting.');
        process.exit(1); // Exit if all retries fail
      }
    }
  }
};

module.exports = { sequelize, connectDB }; 