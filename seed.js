const sequelize = require('./database');
const { Hacker, Skill } = require('./models');
const data = require('./seedData.json');

// Inserts user and their skills into DB
const seedUser = async (user) => {
  try {
    const hacker = await Hacker.create(user);

    await Promise.all(user.skills.map(async (newSkill) => { // TODO: DRY
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
  } catch (err) {
    console.error(err);
  }
};

// Seeds all users from JSON
const seed = () => new Promise(async (resolve, reject) => {
  try {
    await Promise.all(data.map(async (user) => {
      await seedUser(user);
    }));

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
