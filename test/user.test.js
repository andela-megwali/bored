const db = require('../server/models');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { encryptPassword, generateIssueId } = require('../server/util');

chai.use(chaiHttp);
const { expect, request } = chai;

module.exports = () => {
  describe('User CRUD Actions', () => {
    let adminToken;
    let userToken;

    before((done) => {
      // Create a regular user
      request(app).post('/api/v1/signup')
      .send({
        email: 'user@test.com',
        name: 'qwert',
        password: '123qwdfghjk',
      })
      .end((err, res) => {
        userToken = res.body.token;

        // Login as admin user
        request(app).post('/api/v1/login')
        .send({
          email: 'admin@test.com',
          password: '123qwertyu',
        })
        .end((err, res) => {
          adminToken = res.body.token;
          done();
        });
      });
    });

    after((done) => {
      db.User.findOne({
        where: {
          email: 'user@test.com',
        },
      })
      .then(
        user => user.destroy().then(done()),
        err => done(err),
      );
    });

    describe('Listing Users', () => {
      it('Should not list all users to a regular user', (done) => {
        request(app).get('/api/v1/users')
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.include('Forbidden');
          done();
        });
      });

      it('Should list all users to an admin user', (done) => {
        request(app).get('/api/v1/users')
        .send({
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(res.body[0]).to.have.all.keys('admin', 'createdAt', 'email', 'id', 'name', 'updatedAt');
          expect(res.body[0].email).to.equal('admin@test.com');
          expect(res.body[1].email).to.equal('user@test.com');
          done();
        });
      });
    });

    describe('Retrieving a single user', () => {
      it('Should retrieve a single user for any authenticated user', (done) => {
        request(app).get('/api/v1/users/1')
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('email', 'id', 'name');
          expect(res.body.email).to.equal('admin@test.com');
          done();
        });
      });

      it('Should return 404 when user does not exist', (done) => {
        request(app).get('/api/v1/users/10')
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('User not found');
          done();
        });
      });
    });
  });
};
