'use strict';

const { Router } = require('express');
const router = new Router();
const Game = require('../models/game');
const User = require('../models/user');
function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
}

router.get('/', (req, res, next) => {
  let games;
  let users;

  if (req.session.passport) {
    const id = req.session.passport.user;
    Game.find({ creator: { $ne: id } })
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
  } else {
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
  }
});

module.exports = router;
