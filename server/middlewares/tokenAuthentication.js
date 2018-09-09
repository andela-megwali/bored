const jwt = require('jsonwebtoken');
const { User } = require('../models');

const env = process.env.NODE_ENV || 'development';
const { secret } = require('../config/config')[env];

const authenticateRequest = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({ message: 'You must be signed in to perform this action' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Invalid Token' });
    }

    User.findById(decoded.id)
      .then(
        (user) => {
          if (!user) {
            return res.status(404).send({ message: 'User not found' });
          }

          if (decoded.iss !== user.issueId) {
            return res.status(401).send({ message: 'User is logged out' });
          }

          req.decoded = decoded; // remove
          req.decodedUser = user;
          next();
        },
        () => res.status(500).send({ message: 'Server error' }),
      );
  });
};

module.exports = {
  authenticateRequest,
};
