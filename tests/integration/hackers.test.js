const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const { Hacker, Skill } = require('../../models');

describe('Hacker Controller', () => {
  beforeEach(async () => {
    await Hacker.destroy({ truncate: true });
    await Skill.destroy({ truncate: true });
  });

  describe('GET /hackers/:id', () => {
    it('should return a single hacker', async () => {
      const hacker = await Hacker.create({ name: 'Alice', company: "Google", email: "Alice@gmail.com", phone: "5191231234" });
      const skill = await Skill.create({ skillName: 'JavaScript' });
      await hacker.addSkill(skill, { through: { rating: 5 } });

      const response = await request(app).get(`/hackers/${hacker.id}`);
      
      expect(response.status).to.equal(200);
      expect(response.body.name).to.equal('Alice');
      expect(response.body.Skills[0].skillName).to.equal('JavaScript');
      expect(response.body.Skills[0].HackerSkills.rating).to.equal(5);
    });

    it('should return 404 if hacker is not found', async () => {
      const response = await request(app).get('/hackers/9999');
      expect(response.status).to.equal(404);
    });
  });

  describe('GET /hackers', () => {
    it('should return all hackers', async () => {
      const hacker1 = await Hacker.create({ name: 'Alice', company: "Google", email: "Alice@gmail.com", phone: "5191231234" });
      const hacker2 = await Hacker.create({ name: 'Bob', company: "Microsoft", email: "Alice@microsoft.com", phone: "5191239876" });
      const skill1 = await Skill.create({ skillName: 'JavaScript' });
      const skill2 = await Skill.create({ skillName: 'Python' });
      await hacker1.addSkill(skill1, { through: { rating: 5 } });
      await hacker2.addSkill(skill2, { through: { rating: 3 } });

      const response = await request(app).get('/hackers');

      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(2);
      expect(response.body[0].name).to.equal('Alice');
      expect(response.body[1].name).to.equal('Bob');
      expect(response.body[0].Skills[0].skillName).to.equal('JavaScript');
      expect(response.body[0].Skills[0].HackerSkills.rating).to.equal(5);
      expect(response.body[1].Skills[0].skillName).to.equal('Python');
      expect(response.body[1].Skills[0].HackerSkills.rating).to.equal(3);
    });
  });

  describe('POST /hackers', () => {
    it('should create a hacker and add skills', async () => {
      const hackerData = {
        name: 'Alice',
        email: 'alice@example.com',
        company: "alice@google.com",
        phone: "5198843242",
        skills: [
          {
            skill: 'JavaScript',
            rating: 5,
          },
        ],
      };

      const response = await request(app).post('/hackers').send(hackerData);

      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('Alice');
      expect(response.body.email).to.equal('alice@example.com');
      expect(response.body.Skills[0].skillName).to.equal('JavaScript');
      expect(response.body.Skills[0].HackerSkills.rating).to.equal(5);
    });
  });
});
