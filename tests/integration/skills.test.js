const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../app');
const { Skill } = require('../../models');

describe('Skills API', () => {
  let skill;
  
  beforeEach(async () => {
    // Clear the skills table before running tests
    await Skill.destroy({ truncate: true });
  });
  
  describe('POST /skills', () => {
    it('should create a new skill', async () => {
      const skillData = { skill: 'JavaScript' };
      const response = await request(app).post('/skills').send(skillData);
      expect(response.status).to.equal(201);
      expect(response.body.skillName).to.equal(skillData.skill);
      skill = response.body; // save the skill for later use
    });
    
    it('should return an error if the skill already exists', async () => {
      const skillData = { skill: 'JavaScript' };
      const response = await request(app).post('/skills').send(skillData);
      const response2 = await request(app).post('/skills').send(skillData);

      expect(response2.status).to.equal(400);
      expect(response2.body.message).to.equal('skill already exists');
    });
  });
  
  describe('GET /skills', () => {
    it('should return an empty array if no skills are found', async () => {
      const response = await request(app).get('/skills');
      expect(response.status).to.equal(200);
      expect(response.body).to.be.empty;
    });
    
    it('should return an array of skills within the frequency range', async () => {
      const skillData = { skill: 'Python' };
      const response = await request(app).post('/skills').send(skillData);
      expect(response.status).to.equal(201);
      const response2 = await request(app).get('/skills?min_frequency=0&max_frequency=1');
      expect(response2.status).to.equal(200);
      expect(response2.body.length).to.equal(1);
      expect(response2.body[0].skillName).to.eql(skillData.skill);
    });
  });
});