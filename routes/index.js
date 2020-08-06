'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Game = require('../models/game');
const User = require('../models/user');
function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
}

router.get('/', (req, res, next) => {
  const id = res.locals.user._id;
  let games;
  let users;
  Game.find({ creator: { $ne: id } })
    .then(data => {
      console.log(games);
      games = data;
    })
    .catch(error => {
      next(error);
    });
  //here i will slice the array to length of 10

  User.find()
    .then(file => {
      users = file;
    })
    .then(() => {
      shuffle(games);

      if (games.length >= 12) {
        games.splice(1, 11);
      }
      console.log('here are the games', games);
      res.render('index', { users, games });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
