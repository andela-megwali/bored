const db = require('../server/models');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect, request } = chai;

module.exports = () => {
  describe('Signup and login', () => {
    let token;

    after((done) => {
      db.User.findOne({
        where: {
          email: 'auth@test.com',
        },
      })
      .then(
        user => user.destroy().then(done()),
        err => done(err),
      );
    });

    it('Should not create a user when any required field is invalid', (done) => {
      request(app).post('/api/v1/signup')
      .send({
        email: 'auth@test.com',
        name: '',
        password: '123qw',
      })
      .end((err, res) => {
        expect(res.status).to.equal(422);
        expect(res.body).to.have.a.property('errors');
        expect(res.body.errors).to.have.all.keys('name', 'password');
        done();
      });
    });

    it('Should create a regular user when all required fields are valid', (done) => {
      request(app).post('/api/v1/signup')
      .send({
        admin: true,
        email: 'auth@test.com',
        name: 'qwert',
        password: '123qwdfghjk',
      })
      .end((err, res) => {
        token = res.body.token;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.all.keys('token', 'user');
        expect(res.body.user).to.have.all.keys('admin', 'email', 'id', 'name');
        expect(res.body.user.admin).to.equal(false);
        expect(res.body.user.email).to.equal('auth@test.com');
        done();
      });
    });

    it('Should not create a user with email matching an existing user email', (done) => {
      request(app).post('/api/v1/signup')
      .send({
        email: 'admin@test.com',
        name: 'asdfg',
        password: '123qwertyu',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.include('email');
        done();
      });
    });

    it('Should not login a user with invalid credentials', (done) => {
      request(app).post('/api/v1/login')
      .send({
        email: 'admin@test.com',
        password: 'fake-password',
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.include('Invalid credentials');
        done();
      });
    });

    it('Should login a user with valid credentials', (done) => {
      request(app).post('/api/v1/login')
      .send({
        email: 'admin@test.com',
        password: '123qwertyu',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.all.keys('token', 'user');
        expect(res.body.user).to.have.all.keys('admin', 'email', 'id', 'name');
        done();
      });
    });

    it('Should access unprotected routes without authentication', (done) => {
      request(app).get('/api/v1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.include('Pointless being here');
        done();
      });
    });

    it('Should not access protected routes without authentication', (done) => {
      request(app).get('/api/v1/users/1')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.include('You must be signed in to perform this action');
        done();
      });
    });

    it('Should not access protected routes with invalid authentication token', (done) => {
      request(app).get('/api/v1/users/1')
      .send({
        token: 'Invalid_token',
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.include('Invalid Token');
        done();
      });
    });

    it('Should access protected routes with valid authentication token', (done) => {
      request(app).get('/api/v1/users/1')
      .send({
        token,
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('email');
        expect(res.body).to.have.property('name');
        done();
      });
    });
  });
};
