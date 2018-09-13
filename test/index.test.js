process.env.NODE_ENV = 'test';
process.env.PORT = 4001;

const db = require('../server/models');
const { generateIssueId } = require('../server/util');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect, should, request } = chai;

describe('Users', () => {
  beforeEach(() => {
    Object.keys(db).forEach((key) => {
      !['sequelize', 'Sequelize'].includes(key) && db[key].destroy({ where: {}, force: true });
    });

    db.User.create({
      admin: true,
      email: 'sdfghj@tyu.dd',
      issueId: generateIssueId(),
      name: 'asdfg',
      password: '123qwertyu',
    });
  });

  afterEach(() => {
    db.sequelize.close();
  });

  it('Should create a user', (done) => {
    request(app).post('/api/v1/signup')
      .send({
        email: 'sdfghj@tyu.dd',
        name: 'asdfg',
        password: '123qwertyu',
      })
      .end((err, res) => {
        console.log('.........', err)
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('sdfghj@tyu.dd');
        expect(res.body.user.name).to.equal('asdfg');
        done();
      });
  });
  // it('Should assert true to be', (done) => {
  //   request(app).get('/api/v1/signup')
  //     .end((err, res) => {
  //       // expect(res.status).to.equal(404);
  //       expect(res.body.message).to.equal(404);
  //       done();
  //     })
  // });
});
