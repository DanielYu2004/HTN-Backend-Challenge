const Joi = require('joi');

const getHackers = {
};

const createHacker = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    company: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    instagram: Joi.string(),
    twitter: Joi.string(),
    skills: Joi.array().items({
      skill: Joi.string().required(),
      rating: Joi.number().required(),
    }),
  }),
};

const getHackersWithSkill = {
  params: Joi.object().keys({
    skillId: Joi.number().integer().required(),
  }),
};

const removeSkillFromHacker = {
  params: Joi.object().keys({
    skillId: Joi.number().integer().required(),
    id: Joi.number().integer().required(),
  }),
};

const getHacker = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const updateHacker = {
  body: Joi.object().keys({
    name: Joi.string(),
    company: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
    skills: Joi.array().items({
      skill: Joi.string().required(),
      rating: Joi.number().required(),
    }),
  }),
};

const deleteHacker = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const getHackerSkills = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const getHackerSocials = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

const getHackerSocialsQR = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

module.exports = {
  getHackers,
  createHacker,
  getHackersWithSkill,
  removeSkillFromHacker,
  getHacker,
  updateHacker,
  deleteHacker,
  getHackerSkills,
  getHackerSocials,
  getHackerSocialsQR,
};
