const app = require('./app');
const sequelize = require('./database');

const port = process.env.PORT || 3000;

// Sync DB models
sequelize.sync({ force: false })
  .then(() => {
    console.log('Successfully synchronized database models');
  })
  .catch((err) => console.error(err));

// Start server
app.listen(port, () => {
  console.log(`Hack The North REST Express app listening at http://localhost:${port}`);
});

// TODO: exit handler
