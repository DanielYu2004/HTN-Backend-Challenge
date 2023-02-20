const express = require('express');

const router = express.Router();
const { skillsController } = require('../controllers');
const { skillsValidator, validate } = require('../validators');

router
  .route('/')
  .get(validate(skillsValidator.getSkills), skillsController.getSkills)
  .post(validate(skillsValidator.addSkill), skillsController.addSkill);

module.exports = router;
