const Joi = require('joi');

const getSkills = {
  query: Joi.object().keys({
    min_frequency: Joi.number().integer(),
    max_frequency: Joi.number().integer(),
  }),
};

const addSkill = {
  body: Joi.object().keys({
    skill: Joi.string().required(),
  }),
};

module.exports = {
  getSkills,
  addSkill,
};
