const { User } = require('../models');
const {
  decryptPassword,
  encryptPassword,
  generateIssueId,
  generateUserToken,
} = require('../util');

const errorMessage = (err) => {
  const error = err.errors.find(e => e.path);
  return { message: `Bad Request${error ? `, check ${error.path} field` : ''}` };
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
      user => res.status(201).send(generateUserToken(user)),
      err => res.status(400).send(errorMessage(err)),
    );
  },
  login(req, res) {
    return User.findOne({
      where: {
        email: req.body.email,
      },
    })
    .then(
      (user) => {
        const hashedPassword = user && user.password;

        if (!user || !decryptPassword(req.body.password, hashedPassword)) {
          return res.status(401).send({ message: 'Invalid credentials' });
        }

        return res.status(200).send(generateUserToken(user));
      },
      err => res.status(400).send(errorMessage(err)),
    );
  },
};
