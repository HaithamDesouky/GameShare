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
  let gameCreator;
  let user;

  Game.findById(sellersGameId)
    .populate('creator')
    .then(data => {
      console.log(data);
      gameCreator = data.creator;
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
      res.render('new-deal', { user, game, gameCreator });
      res.render('new-deal');
    })
    .catch(error => next(error));
});

dealRouter.post('/new-deal', routeGuard, (req, res, next) => {
  const {
    sellerId,
    sellerName,
    sellerPhoto,
    sellerGame,
    sellerGameName,
    sellerGamePhoto,
    buyerGame,
    startDate,
    endDate,
    comments
  } = req.body;

  const buyerId = res.locals.user._id;
  let buyerGamePhoto;
  let buyerGameName;
  let buyerName;
  let buyerPhoto;

  // Populate Deal Model with users data
  Game.findById(buyerGame)
    .populate('creator')
    .then(data => {
      // console.log('this is data.cretor.name' + data.creator.name);
      // console.log('this is data.cretor.name' + data.creator.photo);
      // console.log('this is data.cretor.name' + data.name);
      // console.log('this is data.cretor.name' + data.name);
      buyerGamePhoto = data.photo;
      buyerGameName = data.name;
      buyerName = data.creator.name;
      buyerPhoto = data.creator.photo;
    })
    .then(() => {
      Deal.create({
        buyer: buyerId,
        buyerName,
        buyerPhoto,
        buyerGame,
        buyerGameName,
        buyerGamePhoto,
        seller: sellerId,
        sellerName, // miss
        sellerPhoto, // miss
        sellerGame, // add
        sellerGameName, // change name
        sellerGamePhoto,
        comments,
        startDate,
        endDate
      });
    })
    .then(() => {
      res.redirect(`/`);
      //res.redirect(`/deal/deal-view/${data._id}`);
    })
    .catch(error => {
      next(error);
    });
});

dealRouter.get('/deal-view/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Deal.findById(id)
    .populate('seller sellerGame buyerGame')
    .then(() => {
      res.render('deal-view');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = dealRouter;
