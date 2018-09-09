const { compareSync, hashSync } = require('bcrypt');
const { randomBytes } = require('crypto');

const saltRounds = 10;

module.exports = {
  decryptPassword: (password, hashedPassword) => compareSync(password, hashedPassword),
  encryptPassword: password => hashSync(password, saltRounds),
  generateIssueId: () => randomBytes(16).toString('hex'),
};
