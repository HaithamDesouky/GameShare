const { Router } = require('express');
const gameRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const User = require('../models/user');


module.exports = gameRouter;
