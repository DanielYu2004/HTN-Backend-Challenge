const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database');

class Skill extends Model { }

Skill.init({
  id: {
    type: DataTypes.INTEGER, // uuid
    primaryKey: true,
    autoIncrement: true,
  },
  skillName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize, // We need to pass the connection instance
  modelName: 'Skill', // We need to choose the model name
});

module.exports = Skill;
