const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const env = process.env.NODE_ENV || 'development';
const { secret } = require('../config/config')[env];

const authenticateRequest = (req, res, successAction) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({ message: 'You must be signed in to perform this action' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Invalid Token' });
    }

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      if (decoded.iss !== user.issueId) {
        return res.status(401).send({ message: 'User is logged out' });
      }

      return successAction(decoded, user);
    }, () => res.status(500).send({ message: 'Server error' }))
  });
};

const errorMessage = (err) => {
  const error = err.errors.find(e => e.path);

  return { message: `Bad Request${error ? `, check ${error.path} field` : '' }`}
};

const getUserToken = (user, res) => {
  const { admin, email, id, issueId, name } = user;
  const payload = { admin, email, id, name };
  const token = jwt.sign(payload, secret, { expiresIn: '1h', issuer: issueId });
  return res.status(201).send({ token, user: payload });
};

module.exports = {
  signup(req, res) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    return User.create({
      email: req.body.email,
      issueId: crypto.randomBytes(16).toString('hex'),
      name: req.body.name,
      password: hashedPassword,
    })
    .then(
      user => getUserToken(user, res),
      err => res.status(400).send(errorMessage(err)),
    );
  },
  login(req, res) {
    return User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      const hashedPassword = user && user.password;

      if (!user || !bcrypt.compareSync(req.body.password, hashedPassword)) {
        return res.status(401).send({ message: 'Invalid credentials' });
      }

      getUserToken(user, res);
    }, () => res.status(500).send({ message: 'Bad request' }));
  },
  authenticate(req, res, next) {
    const authSuccessAction = (decoded, user) => {
      req.decoded = decoded;
      next();
    };

    authenticateRequest(req, res, authSuccessAction);
  },
  logout(req, res) {
    const logoutSuccessAction = (decoded, user) => {
      if (!decoded.admin && decoded.id !== user.id) {
        return res.status(403).send({ message: 'Forbidden' });
      }

      user.update({ issueId: crypto.randomBytes(16).toString('hex') })
        .then(
          () => res.status(200).send({ message: 'Logout successful' }),
          () => res.status(500).send({ message: 'Server error' })
        );
    };

    authenticateRequest(req, res, logoutSuccessAction);
  },
};
