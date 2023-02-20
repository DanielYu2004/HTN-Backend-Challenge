const express = require('express');

const router = express.Router();
const { hackersController } = require('../controllers');
const { hackersValidator, validate } = require('../validators');

router
  .route('/')
  .get(validate(hackersValidator.getHackers), hackersController.getHackers)
  .post(validate(hackersValidator.createHacker), hackersController.createHacker);

router
  .route('/skills/:skillId')
  .get(validate(hackersValidator.getHackersWithSkill), hackersController.getHackersWithSkill);

router
  .route('/:id/skills/:skillId')
  .delete(
    validate(hackersValidator.removeSkillFromHacker),
    hackersController.removeSkillFromHacker,
  );

router
  .route('/:id')
  .get(validate(hackersValidator.getHacker), hackersController.getHacker)
  .put(validate(hackersValidator.updateHacker), hackersController.updateHacker)
  .delete(validate(hackersValidator.deleteHacker), hackersController.deleteHacker);

router
  .route('/:id/skills')
  .get(validate(hackersValidator.getHackerSkills), hackersController.getHackerSkills);

module.exports = router;
