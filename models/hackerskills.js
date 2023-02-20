const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class HackerSkills extends Model { }

HackerSkills.init({
  id: {
    type: DataTypes.INTEGER, // uuid
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize, // We need to pass the connection instance
  modelName: 'HackerSkills', // We need to choose the model name
});

module.exports = HackerSkills;
