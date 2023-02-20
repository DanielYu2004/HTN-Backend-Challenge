const express = require('express');
const hackersRoute = require('./hackersRoute');
const skillsRoute = require('./skillsRoute');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/hackers',
    route: hackersRoute,
  },
  {
    path: '/skills',
    route: skillsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
