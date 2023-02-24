const httpStatus = require('http-status');
const QRCode = require('qrcode');
const { Hacker, Skill } = require('../models');
const { catchAsync, ApiError } = require('../utils');

// TODO: transaction rollbacks

/**
 * GET /hackers/:id
 * Retrieve a single hacker by ID
 */
const getHacker = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Retrieve hacker by id
  const hacker = await Hacker.findOne({
    where: { id },
    include: [
      {
        model: Skill,
        attributes: ['skillName', 'id'],
        through: { attributes: ['rating'] },
      },
    ],
  });

  // Handle hacker does not exist or not found
  if (!hacker) { return next(new ApiError(httpStatus.NOT_FOUND, `Hacker not found: ${id}`)); }

  // TODO: transform skills array

  return res.status(httpStatus.OK).send(hacker);
});

/**
 * GET /hackers
 * Retrieve all hackers
 */
const getHackers = catchAsync(async (req, res) => {
  // Get all hackers
  const hackers = await Hacker.findAll({
    include: [
      {
        model: Skill,
        attributes: [
          'skillName',
          'id',
        ],
        through: {
          attributes: ['rating'],
        },

      },
    ],
  });

  // TODO: transform skills array

  return res.status(httpStatus.OK).send(hackers);
});

/**
 * POST /hackers
 * Create a new hacker
 */
const createHacker = catchAsync(async (req, res) => {
  const userData = req.body;

  // Create hacker
  const hacker = await Hacker.create(userData);

  const { skills } = req.body;

  // Create/update hacker's skills
  if (skills) {
    await Promise.all(skills.map(async (newSkill) => { // TODO: DRY
      let skill = await Skill.findOne({
        where: { skillName: newSkill.skill },
      });

      // If skill doesn't exist, create it
      if (!skill) {
        skill = await Skill.create({
          skillName: newSkill.skill,
        });
      }

      await hacker.addSkill(skill, { through: { rating: newSkill.rating } });
    }));
  }

  return res.status(httpStatus.CREATED).send(await Hacker.findByPk(hacker.id, {
    include: [
      {
        model: Skill,
        attributes: ['skillName', 'id'],
        through: { attributes: ['rating'] },
      },
    ],
  }));
});

/**
 * PUT /hackers/:id
 * Update an already existing hacker
 */
const updateHacker = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const hacker = await Hacker.findByPk(id);

  // Handle hacker not found
  if (!hacker) { return next(new ApiError(httpStatus.NOT_FOUND, `Hacker not found: ${id}`)); }

  await hacker.update(req.body);

  // Update skills if applicable (this implementation doesn't allow deletion of skills by updating)
  const newSkills = req.body.skills;

  if (newSkills) {
    await Promise.all(newSkills.map(async (newSkill) => { // TODO: DRY
      let skill = await Skill.findOne({
        where: { skillName: newSkill.skill },
      });

      // If skill doesn't exist, create it
      if (!skill) {
        skill = await Skill.create({
          skillName: newSkill.skill,
        });
      }

      await hacker.addSkill(skill, { through: { rating: newSkill.rating } });
    }));
  }

  return res.status(httpStatus.OK).send(await Hacker.findByPk(id, {
    include: [
      {
        model: Skill,
        attributes: ['skillName', 'id'],
        through: { attributes: ['rating'] },
      },
    ],
  }));
});

/**
 * DELETE /hackers/:id
 * Delete an existing hacker by ID
 */
const deleteHacker = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find hacker by id
  const hacker = await Hacker.findByPk(id);

  // Handle hacker not found
  if (!hacker) { return next(new ApiError(httpStatus.NOT_FOUND, `Hacker not found: ${id}`)); }

  // Delete hacker
  await hacker.destroy();

  return res.status(httpStatus.NO_CONTENT).send();
});

/**
 * GET /hackers/:id/skills
 * Get all of the skills of a hacker
 */
const getHackerSkills = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find hacker by id
  const hacker = await Hacker.findByPk(id);

  // Handle hacker not found
  if (!hacker) {
    return next(new ApiError(httpStatus.NOT_FOUND, `Hacker not found: ${id}`));
  }

  // Retrieve hacker's skills
  const skills = await hacker.getSkills({ joinTableAttributes: ['rating', 'id', 'createdAt', 'updatedAt'] });

  return res.status(httpStatus.OK).send(skills);
});

/**
 * GET /hackers/skills/:skillId
 * Get all the hackers that possess a specific skill by ID
 */
const getHackersWithSkill = catchAsync(async (req, res) => {
  const { skillId } = req.params;

  // Get all hackers with specified skill
  const hackersWithSkill = await Hacker.findAll({
    include: {
      model: Skill,
      where: {
        id: skillId,
      },
    },
  });
  res.send(hackersWithSkill);
});

/**
 * DELETE /hackers/:id/skills/:skillId
 * Remove a skill from a hacker
 */
const removeSkillFromHacker = catchAsync(async (req, res, next) => {
  const { id, skillId } = req.params;

  const hacker = await Hacker.findByPk(id);

  // Handle hacker not found
  if (!hacker) { return next(new ApiError(httpStatus.NOT_FOUND, `Hacker not found: ${id}`)); }

  const skill = await Skill.findByPk(skillId);

  // Handle skill not found
  if (!skill) { return next(new ApiError(httpStatus.NOT_FOUND, `Skill not found: ${skillId}`)); }

  await hacker.removeSkill(skill);

  // Retrieve updated hacker
  const updatedHacker = await Hacker.findByPk(id, {
    include: [
      {
        model: Skill,
        attributes: ['id', 'skillName'],
        through: { attributes: ['rating'] },
      },
    ],
  });

  return res.status(httpStatus.OK).send(updatedHacker);
});

/**
 * GET /hackers/:id/socials
 * Get links to hacker's socials (html)
 */
const getHackerSocials = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const hacker = await Hacker.findByPk(id);

  // Handle hacker not found
  if (!hacker) { return next(new ApiError(httpStatus.NOT_FOUND, `Hacker not found: ${id}`)); }

  const socials = {
    instagram: hacker.instagram ? `${hacker.instagram}` : 'N/A',
    twitter: hacker.twitter ? `${hacker.twitter}` : 'N/A',
  };

  // Format html response
  const html = `
  <div style="display:flex;flex-direction:column;font-size:50px">
  ${hacker.instagram ? `<a href="https://www.instagram.com/${socials.instagram}">instagram: ${socials.instagram}</a>` : ''}
  ${hacker.twitter ? `<a href="https://twitter.com/${socials.twitter}">twitter: ${socials.twitter}</a>` : ''}
  </div>
  `;

  return res.status(httpStatus.OK).send(html);
});

/**
 * GET /hackers/:id/socials/qr
 * Get the QR code for hacker's social media profiles
 */
const getHackerSocialsQR = catchAsync(async (req, res) => {
  const { id } = req.params;
  const url = `${process.env.ENV === 'dev' ? process.env.DEV_URL : process.env.PROD_URL}:${process.env.PORT}/hackers/${id}/socials`;

  // Generate QR code URL
  const qrImage = await QRCode.toDataURL(url);

  return res.status(httpStatus.OK).send({
    url,
    qr_code: qrImage,
  });
});

module.exports = {
  getHacker,
  getHackers,
  createHacker,
  updateHacker,
  deleteHacker,
  getHackerSkills,
  getHackersWithSkill,
  removeSkillFromHacker,
  getHackerSocials,
  getHackerSocialsQR,
};
