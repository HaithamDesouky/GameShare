const { Router } = require('express');
const gameRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const Game = require('../models/game');
const User = require('./../models/user');

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

gameRouter.get('create', routeGuard, (req, res, next) => {
  res.render('/create');
});

gameRouter.post(
  '/create',
  upload.single('attachment'),
  routeGuard,
  (req, res, next) => {
    const url = req.file.path;
    const { name, date, content, picPath, picName } = req.body;
    Game.create({
      creator: req.session.userId,
      name,
      date,
      content,
      picPath,
      picName
    })
      .then(() => {
        console.log(name, content, url);
        res.redirect('/profile');
      })
      .then(game => {
        return User.findByIdAndUpdate(req.session.userId, {
          $push: { games: game._id }
        });
      })
      .catch(error => {
        next(error);
      });
    res.render('game/create');
  }
);
//Daqui pra baixo
gameRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Game.findById(id)
    .populate('creator')
    .then(game => {
      if (game) {
        res.render('game/single', { game: game });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

gameRouter.post('/:id/delete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.userId;

  Game.findOneAndDelete({ _id: id, creator: userId })
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      next(error);
    });
});

gameRouter.get('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.userId;

  Game.findOne({ _id: id, creator: userId })
    .then(game => {
      if (game) {
        res.render('game/edit', { game });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

gameRouter.post('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const { name, date, content, picPath, picName } = req.body;
  const userId = req.session.userId;

  Game.findOneAndUpdate(
    { _id: id, creator: userId },
    { name, date, content, picPath, picName }
  )
    .then(() => {
      res.redirect('/profile');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = gameRouter;
