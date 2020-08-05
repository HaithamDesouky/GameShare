const { Router } = require('express');
const dealRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const Deal = require('./../models/deal');
const Comment = require('./../models/comment');
const Game = require('./../models/game');
const User = require('./../models/user');

dealRouter.get('/new-deal/:gameId', routeGuard, (req, res, next) => {
  const sellersGameId = req.params.gameId;
  const userId = req.user;
  let gameCreatorName;
  let user;

  Game.findById(sellersGameId)
    .populate('creator')
    .then(data => {
      console.log(data);
      gameCreatorName = data.creator.name;
    });

  User.findById(userId)
    .populate('games')
    .then(userInDB => {
      //user is the buyer
      console.log(userInDB);
      user = userInDB;
      return Game.findById(sellersGameId);
    })
    .then(game => {
      res.render('new-deal', { user, game, gameCreatorName });
      // res.render('new-deal');
    })
    .catch(error => next(error));
});

dealRouter.post('/new-deal', routeGuard, (req, res, next) => {
  const { sellerId, sellerGame, buyerGame, startDate, endDate, comment } = req.body;
  const buyerId = res.locals.user._id;

  Deal.create({
    seller: sellerId,
    sellerGame,
    buyer: buyerId,
    buyerGame,
    startDate,
    endDate,
    comment
  })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = dealRouter;
