const { compareSync, hashSync } = require('bcrypt');
const { randomBytes } = require('crypto');
const { sign } = require('jsonwebtoken');

const env = process.env.NODE_ENV || 'development';
const { secret } = require('./config/config')[env];

const saltRounds = 10;
const generateUserToken = ({ admin, email, id, issueId, name }) => {
  const user = { admin, email, id, name };
  const token = sign(user, secret, { expiresIn: '1h', issuer: issueId });
  return { token, user };
};

module.exports = {
  decryptPassword: (password, hashedPassword) => compareSync(password, hashedPassword),
  encryptPassword: password => hashSync(password, saltRounds),
  generateIssueId: () => randomBytes(16).toString('hex'),
  generateUserToken,
};
