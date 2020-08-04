'use strict';

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');
const Game = require('../models/game');

router.get('/', (req, res, next) => {
  Game.find()
    .then(games => {
      console.log(games);
      res.render('index', { games });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
