require('./index');

// backend/server.js
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

// Use the DATABASE_URL environment variable if available, otherwise use a default URL
const databaseUrl = /*process.env.DATABASE_URL ||*/ 'postgres://tqrqgndt:vHOlUkPcqqAk9V2gWo-VCfgy3fZOncNu@berry.db.elephantsql.com/tqrqgndt';

// Database configuration using the URL
const sequelize = new Sequelize(databaseUrl, {});

// Import the Week model (assuming it's defined in your models/Week.js file)
const Week = require('./models/week')(sequelize, DataTypes);

// Test the database connection within an asynchronous function
async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}



// This middleware will be called for any unhandled requests
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error handler middleware
app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
});

(async () => {
    await testDatabaseConnection();
    // Set up routes, middleware, etc.
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();


