const { Router } = require('express');
const dealRouter = new Router();
const nodemailer = require('nodemailer');
const routeGuard = require('../middleware/route-guard');
const Deal = require('./../models/deal');
const Comment = require('./../models/comment');
const Game = require('./../models/game');
const User = require('./../models/user');

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

dealRouter.get('/history', (req, res, next) => {
  const id = res.locals.user._id;
  let rejectedDeals;
  let acceptedDeals;
  //getting accepted deals

  Deal.find({
    $and: [{ status: 'accepted' }, { $or: [{ seller: id }, { buyer: id }] }]
  })
    .then(data => {
      acceptedDeals = data;
    })
    .then(() => {
      //getting pending incoming offers

      Deal.find({
        $and: [{ status: 'rejected' }, { $or: [{ seller: id }, { buyer: id }] }]
      })
        .then(data => (rejectedDeals = data))
        .then(() => {
          Game.find({ creator: id })
            .then(game =>
              res.render('deal-history', {
                game,
                rejectedDeals,
                acceptedDeals
              })
            )
            .catch(error => next(error));
        });
    });
});

dealRouter.get('/new-deal/:gameId', routeGuard, (req, res, next) => {
  const sellersGameId = req.params.gameId;
  const userId = req.user;
  let gameCreator;
  let user;

  Game.findById(sellersGameId)
    .populate('creator')
    .then(data => {
      gameCreator = data.creator;
    });

  User.findById(userId)
    .populate('games')
    .then(userInDB => {
      //user is the buyer
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
    // .then(user => {
    //   transport.sendMail({
    //     from: process.env.NODEMAILER_EMAIL,
    //     to: process.env.NODEMAILER_EMAIL, // CHANGE THIS // email,
    //     subject: 'Gamechanger: Check out your new exchange proposal',
    //     html: `
    //         <html>
    //           <body>
    //             <a href="http://localhost:3000/profile">Check your most recent exchange request</a>
    //           </body>
    //         </html>
    //       `
    //   });
    // })
    // .then(user => {
    //   transport.sendMail({
    //     from: process.env.NODEMAILER_EMAIL,
    //     to: process.env.NODEMAILER_EMAIL, // CHANGE THIS // email,
    //     subject: 'Gamechanger: Your exchange proposal has been sent.',
    //     html: `
    //         <html>
    //           <body>
    //             <a href="http://localhost:3000/profile">Check your most recent exchange request</a>
    //           </body>
    //         </html>
    //       `
    //   });
    // })
    .then(() => {
      res.redirect(`/profile`);
    })
    .catch(error => {
      next(error);
    });
});

dealRouter.post(`/:id/reject`, routeGuard, (req, res, next) => {
  const id = req.params.id;
  Deal.findByIdAndUpdate(id, { status: 'rejected' })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      next(error);
    });
});

dealRouter.post(`/:id/accept`, routeGuard, (req, res, next) => {
  const id = req.params.id;
  Deal.findByIdAndUpdate(id, { status: 'accepted' })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      next(error);
    });
});

dealRouter.post('/:id/comment', routeGuard, (req, res, next) => {
  const dealId = req.params.id;
  const user = req.session.passport.user;
  console.log('its the user', user);

  Comment.create({
    content: req.body.content,
    creator: req.session.passport.user,
    dealId: dealId
  })
    .then(comment => {
      return Deal.findByIdAndUpdate(dealId, {
        $push: { comments: comment._id }
      });
    })
    .then(() => {
      res.redirect(`/deal/${dealId}`);
    })
    .catch(error => {
      next(error);
    });
});

dealRouter.get('/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const user = req.session.passport.user;
  console.log('HERE IS THE USER THE FUCKIGN COMPUTR IS FUCKING STUPID', user);

  Deal.findById(id)
    .populate({
      path: 'comments',
      populate: { path: 'creator' }
    })
    .then(deal => {
      console.log(deal);
      res.render('deal-view', { deal });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = dealRouter;
