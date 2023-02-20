const { Op, Sequelize } = require('sequelize');
const httpStatus = require('http-status');
const { Hacker, Skill } = require('../models');
const { catchAsync, ApiError } = require('../utils');

/**
 * POST /skills
 */
const addSkill = catchAsync(async (req, res, next) => {
  const skillData = req.body;

  // Find skill by name
  let skill = await Skill.findOne({
    where: { skillName: skillData.skill },
  });

  // If skill doesn't exist, create it
  if (!skill) {
    skill = await Skill.create({
      skillName: skillData.skill,
    });
  } else { // skill already exists
    return next(new ApiError(httpStatus.BAD_REQUEST, 'skill already exists'));
  }

  return res.status(httpStatus.CREATED).send(skill);
});

/**
 * GET /skills?min_frequency=<integer>&max_frequency=<integer>
 */
const getSkills = catchAsync(async (req, res) => {
  /* eslint-disable camelcase */
  const { min_frequency, max_frequency } = req.query;

  const frequency = {
    ...(min_frequency && { [Op.gte]: Sequelize.literal(min_frequency) }),
    ...(max_frequency && { [Op.lte]: Sequelize.literal(max_frequency) }),
  };

  const query = {
    attributes: ['skillName', 'id', 'createdAt', 'updatedAt', [Sequelize.fn('COUNT', Sequelize.col('Hackers.id')), 'frequency']],
    include: [
      {
        model: Hacker,
        attributes: [],
        duplicating: false, // Prevents duplication of Skills
        through: {
          attributes: [],
        },
      },
    ],
    group: ['Skill.id', 'skillName'],
  };

  // include frequency filtering if applicable
  if (min_frequency || max_frequency) query.having = { frequency };

  // Get all skills
  const skills = await Skill.findAll(query);

  return res.status(httpStatus.OK).send(skills);
});

module.exports = {
  addSkill,
  getSkills,
};
