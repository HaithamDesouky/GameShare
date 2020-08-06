'use strict';
const { Router } = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const profileRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const User = require('../models/user');
const Game = require('../models/game');
const Deal = require('../models/deal');

const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});

const upload = multer({ storage });

profileRouter.get('/', (req, res, next) => {
  const id = res.locals.user._id;
  let pendingOffers;
  let pendingRequests;

  //getting outgoing offers that haven't been accepted

  Deal.find({ $and: [{ buyer: id }, { status: 'pending_confirmation' }] })
    .then(data => {
      // console.log('data is ', data);

      pendingRequests = data;
    })
    .then(() => {
      //getting pending incoming offers

      Deal.find({
        $and: [{ seller: id }, { status: 'pending_confirmation' }]
      })
        .then(data => (pendingOffers = data))
        .then(() => {
          console.log('offers', pendingOffers);
          console.log('requests', pendingRequests);
          Game.find({ creator: id })
            .then(game =>
              res.render('profile', {
                game,
                pendingOffers,
                pendingRequests,
                pendingActions: pendingOffers.length
              })
            )
            .catch(error => next(error));
        });
    });
});

//Your history of deals

profileRouter.get('/edit', routeGuard, (req, res, next) => {
  res.render('edit');
});

profileRouter.post(
  '/edit',
  upload.single('photo'),
  routeGuard,
  (req, res, next) => {
    const id = res.locals.user._id;
    const { name, wishlist } = req.body;
    let newPhoto;

    let data;
    if (!req.file) {
      data = {
        name,
        wishlist
      };
    } else {
      newPhoto = req.file.path;
      data = { name, wishlist, photo: newPhoto };
    }

    // console.log(id, name);

    User.findByIdAndUpdate(id, data)
      .then(res.redirect('/profile'))
      .catch(error => next(error));
  }
);

//view for other users to see
profileRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .populate('games')
    .then(user => {
      console.log(user), res.render('other-user', { user });
    });
});
//---------------------------

module.exports = profileRouter;
