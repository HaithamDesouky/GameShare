'use strict';

const { Router } = require('express');
const router = new Router();
const Game = require('../models/game');
const User = require('../models/user');

router.get('/', (req, res, next) => {
  let games;
  let users;

  if (req.session.passport) {
    const id = req.session.passport.user;
    Game.find({ creator: { $ne: id } })
      .then(data => {
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
        if (games.length > 12) {
          games.splice(12, games.length - 1);
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
        console.log('this is games var:' + games);
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
        if (games.length > 12) {
          games.splice(12, games.length - 1);
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
