const { Router } = require('express');
const profileRouter = new Router();
const routeGuard = require('../middleware/route-guard');
const User = require('../models/user');

profileRouter.get('/', (req, res, next) => {
  res.render('profile', { title: 'Hello User!' });
});

profileRouter.get('/edit', routeGuard, (req, res, next) => {
  res.render('edit');
});

profileRouter.post('/edit', routeGuard, (req, res, next) => {
  const id = res.locals.user._id;
  const { name } = req.body;
  console.log(id, name);

  User.findByIdAndUpdate(id, { name })
    .then(res.redirect('/profile'))
    .catch(error => next(error));
});

module.exports = profileRouter;
