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
  res.render('game/create');
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
        return User.findByIdAndUpdate(userId, { $push: { games: game._id } });
      })
      .catch(error => {
        next(error);
      });
    res.render('game/create');
  }
);

module.exports = gameRouter;
