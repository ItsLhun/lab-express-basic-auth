const { Router } = require('express');
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

//Middleware
const routeGuard = require('./../middleware/route-guard');

const router = Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .hash(password, 8)
    .then((passwordHashAndSalt) => {
      console.log(passwordHashAndSalt);
      return User.create({
        username,
        passwordHashAndSalt
      }).then((user) => {
        req.session.user = user._id;
        console.log('New user created: ', user);
        res.redirect('/');
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/log-in', (req, res, next) => {
  res.render('log-in');
});

router.post('/log-in', (req, res, next) => {
  const { username, password } = req.body;
  let user;
  User.findOne({ username })
    .then((document) => {
      user = document;
      if (!document) {
        throw new Error('ACCOUNT_NOT_FOUND');
      } else {
        return bcryptjs.compare(password, document.passwordHashAndSalt);
      }
    })
    .then((comparison) => {
      if (comparison) {
        req.session.user = user._id;
        console.log('User was authenticated');
        res.redirect('/');
      } else {
        throw new Error('WRONG_PASSWORD');
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/log-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/main', routeGuard, (req, res, next) => {
  res.render('cat-pic');
});

router.get('/private', routeGuard, (req, res, next) => {
  res.render('funny-gif');
});

router.get('/profile', routeGuard, (req, res, next) => {
  res.render('profile');
});
router.get('/profile/edit', routeGuard, (req, res, next) => {
  res.render('profile-edit.hbs');
});
router.post('/profile/edit', routeGuard, (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name })
    .then((user) => {
      console.log('User updated successfully');
    })
    .catch((error) => {
      next(error);
    });
  res.redirect('/profile');
});

module.exports = router;
