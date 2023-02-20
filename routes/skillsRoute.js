const express = require('express');

const router = express.Router();
const { skillsController } = require('../controllers');

router
  .route('/')
  .get(skillsController.getSkills)
  .post(skillsController.addSkill);

module.exports = router;
