const db = require('../server/models');
const { encryptPassword, generateIssueId } = require('../server/util');
const AuthTest = require('./auth.test');
const UserTest = require('./user.test');

describe('Routes and API Actions', () => {
  before('Wipe db', () => {
    Object.keys(db).forEach((key) => {
      !['sequelize', 'Sequelize'].includes(key) && db[key].destroy({ where: {}, force: true });
    });

    db.User.create({
      admin: true,
      email: 'admin@test.com',
      issueId: generateIssueId(),
      name: 'asdfg',
      password: encryptPassword('123qwertyu'),
    });
  });

  after(() => {
    // db.sequelize.close();
  });

  // AuthTest();
  describe('Auth Actions', AuthTest);
  describe('User Actions', UserTest);
});
