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

gameRouter.get('/create', routeGuard, (req, res, next) => {
  res.render('create-game');
});

gameRouter.post(
  '/create',
  upload.single('photo'),
  routeGuard,
  (req, res, next) => {
    let photoUpload;
    const { name, date, content } = req.body;
    const id = res.locals.user._id;
    if (!photoUpload) {
      photoUpload =
        'https://res.cloudinary.com/asxisto/image/upload/v1596535816/gamechanger/default_game.png';
    } else {
      photoUpload = req.file.path;
    }
    Game.create({
      creator: id,
      name,
      date,
      content,
      photo: photoUpload
    })
      .then(game => {
        return User.findByIdAndUpdate(id, {
          $push: { games: game._id }
        });
      })
      .then(() => {
        res.redirect('/profile');
      })
      .catch(error => {
        next(error);
      });
  }
);
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
