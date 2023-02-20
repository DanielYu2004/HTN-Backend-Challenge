const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Hacker extends Model { }

Hacker.init({
  id: {
    type: DataTypes.INTEGER, // uuid
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize, // We need to pass the connection instance
  modelName: 'Hacker', // We need to choose the model name
});

module.exports = Hacker;
