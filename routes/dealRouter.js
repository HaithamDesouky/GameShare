const { Router } = require('express');
const dealRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const Deal = require('./../models/deal');
const Comment = require('./../models/comment');
const Game = require('./../models/game');
const User = require('./../models/user');

dealRouter.get('/new-deal', routeGuard, (req, res, next) => {
  res.render('new-deal');
});

dealRouter.post('/new-deal', routeGuard, (req, res, next) => {
  const { startDate, endDate, comment } = req.body;
  const id = res.locals.user._id;

  Deal.create({
    seller: id,
    sellerGame: id,
    buyer: id,
    buyerGame: id,
    startDate,
    endDate,
    comment
  })
    .then(deal => {
      return User.findByIdAndUpdate(id, {
        $push: { deals: deal._id }
      });
    })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = dealRouter;
