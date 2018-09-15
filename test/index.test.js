const db = require('../server/models');
const { encryptPassword, generateIssueId } = require('../server/util');
const AuthTest = require('./auth.test');
const UserTest = require('./user.test');
const TodoTest = require('./todo.test');
const TodoItemTest = require('./todoItem.test');

describe('Routes and API Actions', () => {
  before('Wipe db', (done) => {
    // Taking out only user since the other models are cascaded
    // We'd do this instead if not for cascading
    // Object.keys(db).forEach((key) => {
    //   !['sequelize', 'Sequelize'].includes(key) && db[key].destroy({ where: {}, force: true });
    // });
    db.User.destroy({ where: {}, force: true })
    .then(
      () => {
        db.User.create({
          admin: true,
          email: 'admin@test.com',
          issueId: generateIssueId(),
          name: 'asdfg',
          password: encryptPassword('123qwertyu'),
        })
        .then(() => done(), err => done(err));
      },
      err => done(err),
    );
  });

  describe('Auth Actions', AuthTest);
  describe('User Actions', UserTest);
  describe('Todo Actions', TodoTest);
  describe('TodoItem Actions', TodoItemTest);
});
