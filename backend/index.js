const express = require("express");
const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');
const WeekModel = require('./models/week');


const sequelize = new Sequelize('postgres://tqrqgndt:vHOlUkPcqqAk9V2gWo-VCfgy3fZOncNu@berry.db.elephantsql.com/tqrqgndt');

// Define the Week model using the imported model definition
const week = WeekModel(sequelize, DataTypes);

const app = express();

app.use(express.json());
app.use(cors());

// Sync the database (this will create tables if they don't exist)
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

app.get("/api/run-app", async (req, res) => {
  try {
    const data = await week.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Oops, something went wrong");
  }
});

app.post("/api/run-app", async (req, res) => {
  const { weeksToRace, buildPercent, cutbackWeek, cutbackAmount, runsPerWeek, startingMileage, runPercents, notes } = req.body;

  if (!weeksToRace || !buildPercent || !cutbackWeek || !cutbackAmount || !runsPerWeek || !startingMileage || !runPercents || !notes) {
    return res.status(400).send("all fields required");
  }

  try {
    const week = await week.create({
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

app.put("/api/run-app:id", async (req, res) => {
  const { weeksToRace, buildPercent, cutbackWeek, cutbackAmount, runsPerWeek, startingMileage, runPercents, notes } = req.body;
  const id = parseInt(req.params.id);

  if (!weeksToRace || !buildPercent || !cutbackWeek || !cutbackAmount || !runsPerWeek || !startingMileage || !runPercents || !notes) {
    return res.status(400).send("all fields required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedWeek = await week.update({
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

app.delete("/api/run-app:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await week.destroy({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Oops, something went wrong");
  }
});

app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
