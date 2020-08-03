'use strict';

const { Router } = require('express');
const router = new Router();

const passport = require('passport');

const User = require('./../models/user');

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});
router.post(
  '/sign-up',
  passport.authenticate('local-sign-up', {
    successRedirect: '/private',
    failureRedirect: '/sign-up'
  })
);

router.post(
  '/sign-up',
  passport.authenticate('github', {
    successRedirect: '/private',
    failureRedirect: '/sign-up'
  })
);

router.get('/email-confirmation', (req, res, next) => {
  const mailToken = req.query.token;

  User.findOneAndUpdate({ confirmationToken: mailToken }, { status: 'active' }, { new: true })
    .then(user => {
      res.render('email-confirmation', { user });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post(
  '/sign-in',
  passport.authenticate('local-sign-in', {
    successRedirect: '/private',
    failureRedirect: '/sign-in'
  })
);

router.get(
  '/github',
  passport.authenticate('github', {
    successRedirect: '/private',
    failureRedirect: '/authentication/sign-in'
  })
);

router.get(
  '/github-callback',
  passport.authenticate('github', {
    successRedirect: '/private',
    failureRedirect: '/authentication/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
