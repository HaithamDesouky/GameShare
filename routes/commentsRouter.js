// const { Router } = require('express');
// const commentRouter = new Router();
// const routeGuard = require('../middleware/route-guard');
// const Deal = require('./../models/deal');
// const Comment = require('./../models/comment');
// const Game = require('./../models/game');
// const User = require('./../models/user');

// // commentRouter.get('/deal/:id/comment', routeGuard, (req, res, next) => {
// //   const dealId = req.params.id;

// //   res.render('comment', { dealId });
// // });

// // commentRouter.post('/deal/:id/comment', routeGuard, (req, res, next) => {
// //   const dealId = req.params.id;
// //   const user = req.session.passport.user;
// //   console.log(dealId, user);

// //   Comment.create({
// //     content: req.body.content,
// //     creatorId: user,
// //     dealId: dealId
// //   })
// //     .then(comment => {
// //       return Deal.findByIdAndUpdate(dealId, {
// //         $push: { comments: comment._id }
// //       });
// //     })
// //     .then(() => {
// //       res.redirect(`/deal/${dealId}`);
// //     })
// //     .catch(error => {
// //       next(error);
// //     });
// // });

// // commentRouter.post('/deal/:id/comment', routeGuard, (req, res, next) => {
// //   const dealId = req.params.id;
// //   const user = req.session.currentUser._id;

// //   Comment.create({
// //     content: req.body.content,
// //     creatorId: user,
// //     dealId: dealId
// //   })
// //     .then(comment => {
// //       return Deal.findByIdAndUpdate(dealId, {
// //         $push: { comments: comment._id }
// //       });
// //     })
// //     .then(() => {
// //       res.redirect(`/deal/${dealId}`);
// //     })
// //     .catch(error => {
// //       next(error);
// //     });
// // });

// // dealRouter.get('/post/:id', routeGuard, (req, res, next) => {
// //   const id = req.params.id;
// //   Post.findById(id)
// //     .populate('creatorId')
// //     .populate({
// //       path: 'comments',
// //       populate: { path: 'creatorId' }
// //     })
// //     .then(post => {
// //       console.log('HERE IS TE POST', post);
// //       res.render('single', { post });
// //     })
// //     .catch(error => next(error));
// // });

// module.exports = commentRouter;
