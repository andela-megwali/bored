const { encryptPassword, generateIssueId } = require('../util');
const { User } = require('../models');

module.exports = {
  list(req, res) {
    if (!req.currentUser.admin) {
      return res.status(403).send({ message: 'Forbidden' });
    }

    return User.findAll({
      attributes: { exclude: ['password', 'issueId'] },
    })
      .then((users) => {
        if (!users) {
          return res.status(404).send({ message: 'No users found' });
        }

        return res.status(200).send(users);
      }, err => res.status(400).send(err));
  },
  retrieve(req, res) {
    const attributes = ['email', 'id', 'name'];

    if (req.currentUser.id === +req.params.userId) {
      const user = {};
      attributes.forEach((attr) => {
        user[attr] = req.currentUser[attr];
      });

      return res.status(200).send(user);
    }

    return User.findById(req.params.userId, { attributes })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }

        return res.status(200).send(user);
      }, err => res.status(400).send(err));
  },
  update(req, res) {
    const updateUser = (user, fields) => {
      if (req.body.password) {
        req.body.password = encryptPassword(req.body.password);
      }

      return user.update(req.body, { fields })
      .then(
        () => res.status(200).send({ message: 'User Updated' }),
        err => res.status(400).send(err),
      );
    };

    if (+req.params.userId !== req.currentUser.id) {
      if (req.currentUser.admin) {
        return User.findById(req.params.userId)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: 'User not found' });
          }

          const fields = Object.keys(req.body).filter(f => f !== 'issueId');
          updateUser(user, fields);
        }, err => res.status(400).send(err));
      }

      return res.status(403).send({ message: 'Forbidden' });
    }

    // Users cannot change their own admin status only other admins can
    const fields = Object.keys(req.body).filter(f => (f !== 'admin' && f !== 'issueId'));
    updateUser(req.currentUser, fields);
  },
  destroy(req, res) {
    if (+req.params.userId !== req.currentUser.id) {
      if (req.currentUser.admin) {
        return User.findById(req.params.userId)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: 'User not found' });
          }

          return user.destroy()
          .then(() => res.status(204).send(), err => res.status(400).send(err));
        }, err => res.status(500).send(err));
      }

      return res.status(403).send({ message: 'Forbidden' });
    }

    return req.currentUser.destroy()
    .then(() => res.status(204).send(), err => res.status(400).send(err));
  },
  logout(req, res) {
    if (req.params.userId && req.currentUser.admin && req.currentUser.id !== +req.params.userId) {
      return User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'User not found' });
        }

        user.update({ issueId: generateIssueId() })
          .then(
            () => res.status(200).send({ message: `Logout of user ${user.id} successful` }),
            () => res.status(500).send({ message: 'Server error' }),
          );
      }, () => res.status(500).send({ message: 'Server error' }));
    }

    return req.currentUser.update({ issueId: generateIssueId() })
    .then(
      () => res.status(200).send({ message: 'Logout successful' }),
      () => res.status(500).send({ message: 'Server error' }),
    );
  },
};
