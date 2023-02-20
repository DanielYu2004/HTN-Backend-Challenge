/* eslint-disable */
const sequelize = require('./database');
const { Hacker, Skill } = require('./models');
const data = require('./seedData.json');

// Inserts user and their skills into DB
const seedUser = (user) => new Promise(async (resolve, reject) => {
  try {
    const hacker = await Hacker.create(user);

    for (let i = 0; i < user.skills.length; i++) {
      let skill = await Skill.findOne({
        where: { skillName: user.skills[i].skill },
      });

      // If skill doesn't exist, create it
      if (!skill) {
        skill = await Skill.create({
          skillName: user.skills[i].skill,
        });
      }
      await hacker.addSkill(skill, { through: { rating: user.skills[i].rating } });
      resolve();
    }
  } catch (err) {
    console.error(err);
  }
});

// Seeds all users from JSON
const seed = () => new Promise(async (resolve, reject) => {
  try {
    for (let i = 0; i < data.length; i++) {
      await seedUser(data[i]);
    }

    resolve();
  } catch (err) {
    reject(err);
  }
});

// Sync and seed the DB
sequelize.sync({ force: true })
  .then(() => {
    console.log('Successfully synchronized database models');

    console.log('Seeding database with initial data, may take a few seconds...');
    return seed();
  })
  .then(() => {
    console.log('Successfully seeded database with initial data');
  })
  .catch((err) => console.error(err));
