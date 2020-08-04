const { Router } = require('express');
const gameRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const Game = require('./../models/game');
const User = require('./../models/user');

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

gameRouter.get('/platform', routeGuard, (req, res, next) => {
  const platformInput = req.query.platform;
  console.log(platformInput);

  Game.find({ platform: platformInput })
    .then(games => {
      res.render('platform', { games, platformInput });
    })
    .catch(error => {
      next(error);
    });
});

gameRouter.get('/create', routeGuard, (req, res, next) => {
  res.render('create-game');
});

gameRouter.post(
  '/create',
  upload.single('photo'),
  routeGuard,
  (req, res, next) => {
    const { name, date, content, platform } = req.body;
    const id = res.locals.user._id;
    let photoUpload;
    !req.file
      ? (photoUpload =
          'https://res.cloudinary.com/asxisto/image/upload/v1596535816/gamechanger/default_game.png')
      : (photoUpload = req.file.path);
    console.log(photoUpload);
    Game.create({
      creator: id,
      name,
      date,
      content,
      photo: photoUpload,
      platform
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
gameRouter.get('/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Game.findById(id)
    .populate('creator')
    .then(game => {
      if (game) {
        res.render('single-game', { game: game });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

gameRouter.get('/:id/delete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.passport.user;
  console.log(id, userId);

  Game.findOneAndDelete({ _id: id, creator: userId })
    .then(game => {
      res.redirect('/profile');
    })
    .catch(error => {
      next(error);
    });
});

gameRouter.get('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.passport.user;

  Game.findOne({ _id: id, creator: userId })
    .then(game => {
      if (game) {
        res.render('edit-game', { game });
      } else {
        next();
      }
    })
    .catch(error => {
      next(error);
    });
});

gameRouter.post(
  '/:id/edit',
  upload.single('photo'),
  routeGuard,
  (req, res, next) => {
    const id = req.params.id;
    const userId = req.session.passport.user;
    const { name, date, content, platform } = req.body;
    let newGamePhoto;

    let data;
    if (!req.file) {
      data = {
        name,
        date,
        content,
        platform
      };
    } else {
      newGamePhoto = req.file.path;
      data = { name, date, content, platform, photo: newGamePhoto };
    }

    Game.findOneAndUpdate({ _id: id, creator: userId }, data)
      .then(() => {
        res.redirect('/profile');
      })
      .catch(error => {
        next(error);
      });
  }
);

module.exports = gameRouter;
