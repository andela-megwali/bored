const { decryptPassword, encryptPassword, generateIssueId } = require('../util');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const env = process.env.NODE_ENV || 'development';
const { secret } = require('../config/config')[env];

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
    return User.create({
      email: req.body.email,
      issueId: generateIssueId(),
      name: req.body.name,
      password: encryptPassword(req.body.password),
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

      if (!user || !decryptPassword(req.body.password, hashedPassword)) {
        return res.status(401).send({ message: 'Invalid credentials' });
      }

      getUserToken(user, res);
    }, () => res.status(500).send({ message: 'Bad request' }));
  },
};
