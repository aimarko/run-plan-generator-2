// backend/models/Week.js
module.exports = (sequelize, DataTypes) => {
  const week = sequelize.define('week', {
    weeksToRace: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buildPercent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cutbackWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cutbackAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    runsPerWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startingMileage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    runPercents: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  // Add any associations or other configuration if needed

  return week;
};
