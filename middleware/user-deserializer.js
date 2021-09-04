const User = require('./../models/user');

const userDeserializer = (req, res, next) => {
  const userId = req.session.user;
  if (userId) {
    User.findById(userId)
      .then((userDoc) => {
        req.user = userDoc;
        res.locals.user = userDoc;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next();
  }
};

module.exports = userDeserializer;
