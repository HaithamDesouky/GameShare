'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const User = require('./models/user');
const nodemailer = require('nodemailer');
const bcryptjs = require('bcryptjs');

//const routeGuard = require('./../middleware/route-guard');

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
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
      const { name, status } = req.body;
      const token = generateRandomToken(40);

      bcryptjs
        .hash(password, 10)
        .then(hash => {
          return User.create({
            name,
            email,
            passwordHash: hash,
            status,
            confirmationToken: token
          });
        })
        .then(user => {
          req.session.user = user._id;
          transport
            .sendMail({
              from: process.env.NODEMAILER_EMAIL,
              to: process.env.NODEMAILER_EMAIL, // CHANGE THIS // email,
              subject: 'Gamechanger: Sign-up Confirmation',
              html: `
                <html>
                  <body>
                    <p>Please confirm your account:</p>
                    <a href="http://localhost:3000/authentication/email-confirmation?token=${token}">Confirmation Link</a>
                  </body>
                </html>
              `
            })
            .then(result => {
              console.log('Email was sent successfuly.');
              console.log(result);
              callback(null, user);
            });
        })
        .catch(error => {
          console.log('There was an error sending the email.');
          callback(error);
        });
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
          callback(new Error('WRONG_PASSWORD'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);

/*
passport.use(
  'github',
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/authentication/github-callback',
      scope: 'user:email'
    },
    (accessToken, refreshToken, profile, callback) => {
      const {
        displayName: name,
        emails,
        photos: [{ value: photo } = {}] = []
      } = profile;
      const primaryEmail = emails.find(email => email.primary).value;
      User.findOne({ email: primaryEmail })
        .then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              email: primaryEmail,
              photo,
              name,
              githubToken: accessToken
            });
          }
        })
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);
*/
