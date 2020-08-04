'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Game = require('../models/game');
const User = require('../models/user');

router.get('/', (req, res, next) => {
  let games;
  let users;
  Game.find()
    .then(data => {
      console.log(games);
      games = data;
    })
    .catch(error => {
      next(error);
    });

  User.find()
    .then(file => {
      users = file;
    })
    .then(() => {
      console.log('here are the games', games);
      console.log('here are the users', users);
      res.render('index', { users, games });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
