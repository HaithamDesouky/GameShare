'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});

const upload = multer({ storage });

const User = require('./models/user');

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

const generateRandomToken = length => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

passport.use(
  'local-sign-up',
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, callback) => {
      const { name, status, wishlist, latitude, longitude } = req.body;
      const token = generateRandomToken(40);
      let userPhoto;
      !req.file
        ? (userPhoto =
            'https://res.cloudinary.com/asxisto/image/upload/c_scale,w_200/v1596535475/gamechanger/default_user.png')
        : (userPhoto = req.file.path);

      let existingUser;
      User.findOne({
        email
      }).then(data => {
        existingUser = data;
        console.log(existingUser, 'already exists');
      });

      if (existingUser) {
        callback(
          new Error(
            'Your password does not match the email in our records, please try again.'
          )
        );
      } else {
        bcryptjs
          .hash(password, 10)
          .then(hash => {
            return User.create({
              name,
              email,
              passwordHash: hash,
              status,
              wishlist,
              photo: userPhoto,
              location: {
                coordinates: [latitude, longitude]
              },
              confirmationToken: token
            });
          })
          .then(user => {
            req.session.user = user._id;
            callback(null, user);
          })
          .catch(error => {
            callback(
              new Error(
                'Sorry, it seems like this email is already taken! Please try again!'
              )
            );
          });
      }
    }
  )
);

passport.use(
  'local-sign-in',
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
    let user;
    User.findOne({
      email
    })
      .then(document => {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      })
      .then(passwordMatchesHash => {
        if (passwordMatchesHash) {
          callback(null, user);
        } else {
          callback(
            new Error(
              'Your password does not match the email in our records, please try again.'
            )
          );
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);
