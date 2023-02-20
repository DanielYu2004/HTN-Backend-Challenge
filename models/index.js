const Hacker = require('./hacker');
const Skill = require('./skill');
const HackerSkills = require('./hackerskills');

// Create many to many association between hackers and skills
Hacker.belongsToMany(Skill, { through: HackerSkills });
Skill.belongsToMany(Hacker, { through: HackerSkills });

module.exports = { Hacker, Skill, HackerSkills };
