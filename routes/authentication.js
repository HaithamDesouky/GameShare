'use strict';

const { Router } = require('express');
const router = new Router();

const passport = require('passport');
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const User = require('./../models/user');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});

const upload = multer({ storage });

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post(
  '/sign-up',
  upload.single('photo'),
  passport.authenticate('local-sign-up', {
    successRedirect: '/profile',
    failureRedirect: '/sign-up'
  })
);

router.post(
  '/sign-up',
  upload.single('photo'),
  passport.authenticate('github', {
    successRedirect: '/profile',
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
    successRedirect: '/profile',
    failureRedirect: '/sign-in'
  })
);

router.get(
  '/github',
  passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/authentication/sign-in'
  })
);

router.get(
  '/github-callback',
  passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/authentication/sign-in'
  })
);

router.post('/sign-out', (req, res, next) => {
  req.logout();
  res.render('sign-out');
});

module.exports = router;
