const express = require('express');

const router = express.Router();
const { hackersController } = require('../controllers');

// TODO: validators

router
  .route('/')
  .get(hackersController.getHackers)
  .post(hackersController.createHacker);

router
  .route('/skills/:skillId')
  .get(hackersController.getHackersWithSkill);

router
  .route('/:id/skills/:skillId')
  .delete(hackersController.removeSkillFromHacker);

router
  .route('/:id')
  .get(hackersController.getHacker)
  .put(hackersController.updateHacker)
  .delete(hackersController.deleteHacker);

router
  .route('/:id/skills')
  .get(hackersController.getHackerSkills);

module.exports = router;
