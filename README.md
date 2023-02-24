

# HTN-Backend-Challenge

# Overview
This is a RESTful API written with Express and Sequelize. It provides CRUD functionality for managing hacker data, along with other cool features like a QR code system for hacker social media profiles. This is my submission for the Hack the North Backend Challenge. 

If you have any questions, please feel free to email me at dm3yu@uwaterloo.ca


# Usage

The API is publicly accessible at: http://54.146.98.209:3000

Here is how you can get started with the API:

If you have docker installed, simply running `docker-compose up` will build the docker image and get everything up and running. This will also automatically refresh and seed the database with the example data.

Otherwise, to run the app:

 1. Ensure node/npm is installed
 2. Run  `npm install` to install all the required dependencies
 3. Run  `npm run seed` to seed the database with the example data (this will clear and reseed the database)
 4. Run `npm start`, and the app should be listening on port 3000
 
 ## Testing
To run the integration tests located in `/tests/integration`, run the following command:

    npm run test

# Tech Stack
App:

 - Express 
 - Sequelize
 - SQLite3
- Other dependencies: 
	- Joi 
	- Http-status
	- Eslint 
	- Nodemon
	- dotenv
	- qrcode

Testing:
- Mocha
- Chai
- Supertest

Deployment:
- EC2

# Implementation
##  App structure:
```
.
├── ...
├── controllers  	# main endpoint functionality
├── models              # database table schemas
├── routes              # endpoints
├── tests               # integration tests
├── utils		# helpers, utility, and middleware
├── database.js         # DB initialization
├── hackers.sqlite      # SQLite DB
├── seed.js             # script to seed DB
└── seedData.json       # the initial sample data
```
Database partitioning 
-
To ensure data consistency and optimize data retrieval, I partitioned the database into three tables: Hacker, Skill, and HackerSkills. Check it out here: https://drawsql.app/teams/daniel-yu/diagrams/htn/embed

The Hacker and Skill models were created to store all the necessary data for each entity, while the HackerSkills table was used as a junction table to maintain associations between Hackers and Skills. This design allowed for flexibility in querying, as a single hacker could have multiple skills and multiple hackers could possess the same skill. I also included a rating field in HackerSkills, that allows aggregation of data about specific skills and gain insights such as how many hackers have a particular skill or other potential features like the average rating of a specific skill. 

By following standard normalization rules, I eliminated redundant data and ensured that the database is logically structured, making it easier to maintain and query.

Social Media QR Codes
- 
I really enjoyed the social media QR code system Hack the North had at 2022's event. It made networking with other participants seem really natural, and I was quite surprised that I've never seen this feature implemented at other hackathons before. Since the deadline was extended, I decided to steal that functionality for my challenge submission. How does it work?

When updating/creating a hacker, you can additionally add `instagram` and `twitter` fields that represent the hacker's respective social media handle. Hackers can then generate a QR code (or url), that other hackers can scan with their phone (or go to the url) to see a page of that person's social media profiles. 

Features:
-
- Data Validation
	- User input data is validated with Joi against schemas to ensure the validity and integrity of incoming data
	- Prevents errors, ensures database consistency, and could help prevent malicious attacks
- Error handling 
	- On error (4XX/5XX), standardized error responses with custom messages and appropriate HTTP status codes are returned to the client
	- Provides client with clear and concise data, while preventing attackers from gaining information about the system through error messages.
- Testing
	- There are integration tests that verify Hackers and Skills endpoint functionality
	- This allows for cleaner and more maintainable code, while preventing regressions
- Eslint
	- Used to enforce consistent code style and readability


# Endpoints
Feel free to play around with the endpoints and run them in Postman: https://documenter.getpostman.com/view/15504431/2s93CHvFt3

Required Endpoints
- 
#### All Users 
- `GET /hackers`
- Description: returns all hackers' information.
#### User Information 
- `GET /hackers/:id`
- Description: returns specific hacker's information by hacker id. Returns 404 if hacker not found.
#### Updating User Data
- `PUT /hackers/:id`
- Description: update hacker information (supports partial updates) and return the full hacker info after update. Will create new skills if skill does not exist yet, otherwise will update rating of existing skill. It is not possible to remove skills by updating, please refer to Remove Skill From User endpoint. Returns 404 if hacker not found.
- Sample Body:
```
{
    "name": "Not Breanna Dillon",
    "company": "Not Jackson Ltd",
    "skills": [
        {
            "skill": "New Skill",
            "rating": "5"
        },
        {
            "skill": "Swift",
            "rating": 0
        }
    ],
    "twitter": "idonthaveatwitter"
}
```
#### Skills Endpoint
- `GET /skills?min_frequency=#&max_frequency=#`
- Description: returns all skills within the `min_frequency` and `max_frequency`, with frequency of how many hackers have each skill.


Additional endpoints
- 
#### Create User
- `POST /hackers`
- Description: creates a new hacker and returns the newly created hacker with new id. 
- Sample Body:
```
{
    "name": "Daniel Yu",
    "company": "Daniel Yu's Company",
    "email": "daniel@daniel.com",
    "phone": "123-123-1234",
    "skills": [
        {
            "skill": "New Skill",
            "rating": 1
        },
        {
            "skill": "Express",
            "rating": 5
        }
    ],
    "instagram": "daniel_me__"
}
```

#### Delete User
- `DELETE /hackers/:id`
- Description: deletes an existing hacker, and returns no content. Returns 404 if hacker not found.
#### Remove Skill From User
- `DELETE /hackers/:id/skills/:skillId`
- Description: removes a skill from a specific hacker. Returns 404 if hacker or skill not found.
#### Get User's Skills
- `GET /hackers/:id/skills`
- Description: returns all the skills of a specific hacker by hacker's id.
#### Get Users With Skill
- `GET /hackers/skills/:skillId`
- Description: returns all the hackers that possess a specific skill by the skill's id.
#### Add Skill
- `GET /skills`
- Description: adds a skill to the database. The thinking behind this is in a registration form, there should be example skills to select from, in addition to new skills inputted by user. 

Social Media Endpoints
-

#### Get Hacker's Socials
- `GET /hackers/:id/socials`
- Description: return a page displaying links to the hacker's social media profiles
#### Get Hacker's QR Code
- `GET /hackers/:id/socials/qr`
- Description: returns a QR code that can be scanned to view the hacker's social media profiles, along with an alternative url. (note: if testing locally, and not the live server, please use the url as scanning the QR code with your phone will not work)


# Improvements To Be Made
- Database query optimizations
	- The current queries return the nested skill's model data in an annoying format, since I couldn't find a sequelize query that would give me exactly what I wanted
		- I could've processed the data after the query to transform it and get it in the exact format but this is very inefficient for routes like `GET /hackers` with thousands of entries. In hindsight, it probably would've been easier to just write a raw SQL query 
	- Some routes like `PUT /hackers/:id` have multiple DB queries--some of which are excess-- that makes the app inefficient. A limit into how many skills a user can have also needs to be introduced whether through validators or model 
- Use sequelize-cli
	- Next time, I would use the sequelize-cli to generate my DB models and other useful features mentioned below, instead of manually writing them myself. I definitely should've used this to begin with.
- Database schema migrations 
	- I didn't use database migrations for this project as the models were quite small and weren't going to change
	- If this project were to be continued, I definitely would use database migrations to keep track of the incremental schema changes as more features are added to the API
- Database seeders 
	- The current method of seeding the DB is inefficient and is bottlenecked by JS promises
	- I would sequelize seeders to insert the initial data more efficiently. It would also allow for the ability to manage and reset database states, making development and testing easier
- Write more unit and integration tests
	- I would write more comprehensive tests that have more code coverage and depth, to improve code quality and prevent regression
- More query options for GET
	- Most of the GET endpoints should include an "include" query parameter that specifies exactly what fields from the model to return. Sequelize automatically adds a "createdAt" and "updatedAt" field or foreign keys, and the endpoints should include the ability to specify exactly what data should be returned. This helps keep things clean, flexible and efficient.


# Future Considerations
- Use Postgres
	- for better scalability and efficiency purposes under high traffic
- Add authentication middleware
	- to make sure only authorized users have access
- Setup cors
	- To prevent attacks and make sure only allowed-urls can access the API
- Use Typescript
	- I would heavily consider using Typescript for the type safety and consistency, if this project would go to production
