const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');
const WeekModel = require('./models/week');

const sequelize = new Sequelize('postgres://tqrqgndt:vHOlUkPcqqAk9V2gWo-VCfgy3fZOncNu@berry.db.elephantsql.com/tqrqgndt');
const Week = WeekModel(sequelize, DataTypes);

const app = express();

app.use(express.json());
app.use(cors());

// Test the database connection within an asynchronous function
async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Sync the database (this will create tables if they don't exist)
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
});

// Set up routes
app.get("/api/run-app", async (req, res) => {
    try {
        const data = await Week.findAll();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Oops, something went wrong");
    }
});

app.post("/api/run-app", async (req, res) => {
    const { weeksToRace, buildPercent, cutbackWeek, cutbackAmount, runsPerWeek, startingMileage, runPercents, notes } = req.body;

    if (!weeksToRace || !buildPercent || !cutbackWeek || !cutbackAmount || !runsPerWeek || !startingMileage || !runPercents || !notes) {
        return res.status(400).send("All fields required");
    }

    try {
        const week = await Week.create({
            weeksToRace,
            buildPercent,
            cutbackWeek,
            cutbackAmount,
            runsPerWeek,
            startingMileage,
            runPercents,
            notes,
        });
        res.json(week);
    } catch (error) {
        console.error(error);
        res.status(500).send("Oops, something went wrong");
    }
});

app.put("/api/run-app/:id", async (req, res) => {
    const { weeksToRace, buildPercent, cutbackWeek, cutbackAmount, runsPerWeek, startingMileage, runPercents, notes } = req.body;
    const id = parseInt(req.params.id);

    if (!weeksToRace || !buildPercent || !cutbackWeek || !cutbackAmount || !runsPerWeek || !startingMileage || !runPercents || !notes) {
        return res.status(400).send("All fields required");
    }

    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number");
    }

    try {
        const updatedWeek = await Week.update({
            weeksToRace,
            buildPercent,
            cutbackWeek,
            cutbackAmount,
            runsPerWeek,
            startingMileage,
            runPercents,
            notes,
        }, {
            where: { id },
        });
        res.json(updatedWeek);
    } catch (error) {
        console.error(error);
        res.status(500).send("Oops, something went wrong");
    }
});

app.delete("/api/run-app/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(400).send("ID field required");
    }

    try {
        await Week.destroy({
            where: { id },
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Oops, something went wrong");
    }
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
    // Start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
