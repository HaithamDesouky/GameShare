const { Router } = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const profileRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const User = require('../models/user');
const Game = require('../models/game');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});

const upload = multer({ storage });

profileRouter.get('/', (req, res, next) => {
  const id = res.locals.user._id;
  Game.find({ creatorId: id }).then(game => res.render('profile', { game }));
});

profileRouter.get('/edit', routeGuard, (req, res, next) => {
  res.render('edit');
});

profileRouter.post(
  '/edit',
  upload.single('photo'),
  routeGuard,
  (req, res, next) => {
    const id = res.locals.user._id;
    const { name } = req.body;
    const newPhoto = req.file.path;

    // console.log(id, name);

    User.findByIdAndUpdate(id, { name, photo: newPhoto })
      .then(res.redirect('/profile'))
      .catch(error => next(error));
  }
);

module.exports = profileRouter;
