const db = require('../server/models');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect, request } = chai;

module.exports = () => {
  describe('User CRUD Actions', () => {
    let adminToken;
    let userId;
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
        userId = res.body.user.id;
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
          expect(res.body[0]).to.have.all.keys('admin', 'createdAt', 'email', 'id', 'name', 'updatedAt');
          expect(res.body[0].email).to.equal('admin@test.com');
          done();
        });
      });
    });

    describe('Retrieving a single user', () => {
      it('Should retrieve another user details without admin field', (done) => {
        request(app).get('/api/v1/users/1')
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('email', 'id', 'name');
          expect(res.body).to.not.have.property('admin');
          expect(res.body.email).to.equal('admin@test.com');
          done();
        });
      });

      it('Should allow users to retrieve their details with admin field', (done) => {
        request(app).get(`/api/v1/users/${userId}`)
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('admin', 'email', 'id', 'name');
          expect(res.body.email).to.equal('user@test.com');
          done();
        });
      });

      it('Should allow admins to retrieve other users details with admin field', (done) => {
        request(app).get(`/api/v1/users/${userId}`)
        .send({
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('admin', 'email', 'id', 'name');
          expect(res.body.email).to.equal('user@test.com');
          done();
        });
      });

      it('Should return 404 when user does not exist', (done) => {
        request(app).get('/api/v1/users/100')
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

    describe('Updating a user', () => {
      let upgradedUserId;
      let upgradedUserToken;

      before((done) => {
        // Create another regular user
        request(app).post('/api/v1/signup')
        .send({
          email: 'upgradedUser@test.com',
          name: 'Upgrade',
          password: '123qwdfghjk',
        })
        .end((err, res) => {
          upgradedUserId = res.body.user.id;
          upgradedUserToken = res.body.token;
          done();
        });
      });

      it('Should allow update of a users personal details', (done) => {
        request(app).put(`/api/v1/users/${userId}`)
        .send({
          token: userToken,
          name: 'new name',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('User Updated');

          request(app).get(`/api/v1/users/${userId}`)
          .send({
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('admin', 'email', 'id', 'name');
            expect(res.body.name).to.equal('new name');
            done();
          });
        });
      });

      it('Should ignore update of a user admin status', (done) => {
        request(app).put(`/api/v1/users/${upgradedUserId}`)
        .send({
          admin: true,
          name: 'self upgrade failed',
          token: upgradedUserToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('User Updated');

          request(app).get(`/api/v1/users/${upgradedUserId}`)
          .send({
            token: upgradedUserToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal('self upgrade failed');
            expect(res.body.admin).to.equal(false);
            done();
          });
        });
      });

      it('Should allow admins update any personal details of other users', (done) => {
        request(app).put(`/api/v1/users/${upgradedUserId}`)
        .send({
          admin: true,
          name: 'new admin upgrade',
          password: 'new password',
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('User Updated');

          request(app).get(`/api/v1/users/${upgradedUserId}`)
          .send({
            token: upgradedUserToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('admin', 'email', 'id', 'name');
            expect(res.body.name).to.equal('new admin upgrade');
            expect(res.body.admin).to.equal(true);
            done();
          });
        });
      });

      it('Should prevent non admins from updating personal details of other users', (done) => {
        request(app).put('/api/v1/users/1')
        .send({
          token: userToken,
          name: 'messed up name',
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Forbidden');

          request(app).get('/api/v1/users/1')
          .send({
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('email', 'id', 'name');
            expect(res.body.name).to.equal('asdfg');
            done();
          });
        });
      });

      it('Should return 404 if admins try to update a user that does not exist', (done) => {
        request(app).put('/api/v1/users/100')
        .send({
          token: adminToken,
          name: 'admin changed name',
          password: 'new password',
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('User not found');
          done();
        });
      });
    });

    describe('Deleting a user', () => {
      it('Should disallow deletion of a user by other non admin users', (done) => {
        request(app).delete('/api/v1/users/1')
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Forbidden');
          done();
        });
      });

      it('Should allow deletion of a user profile by self', (done) => {
        request(app).post('/api/v1/signup')
        .send({
          email: 'deleted@test.com',
          name: 'qwert',
          password: 'deleted0ne',
        })
        .end((err, res) => {
          const deletedUserId = res.body.user.id;
          const deletedUserToken = res.body.token;

          request(app).delete(`/api/v1/users/${deletedUserId}`)
          .send({
            token: deletedUserToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(204);
            expect(res.body).to.eql({});

            request(app).get(`/api/v1/users/${deletedUserId}`)
            .send({
              token: deletedUserToken,
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

      it('Should allow deletion of a user profile by admin', (done) => {
        request(app).post('/api/v1/signup')
        .send({
          email: 'deleted@test.com',
          name: 'qwert',
          password: 'deleted0ne',
        })
        .end((err, res) => {
          const deletedUserId = res.body.user.id;

          request(app).delete(`/api/v1/users/${deletedUserId}`)
          .send({
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(204);
            expect(res.body).to.eql({});

            request(app).get(`/api/v1/users/${deletedUserId}`)
            .send({
              token: userToken,
            })
            .end((err, res) => {
              expect(res.status).to.equal(404);
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.include('not found');
              done();
            });
          });
        });
      });

      it('Should return 404 if no matching user is found', (done) => {
        request(app).delete('/api/v1/users/100')
        .send({
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('User not found');
          done();
        });
      });
    });

    describe('Logout', () => {
      it('Should logout an authenticated user', (done) => {
        request(app).get('/api/v1/logout')
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Logout successful');

          request(app).get('/api/v1/users/1')
          .send({
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.include('User is logged out');
            done();
          });
        });
      });

      describe('Logout with user id param', () => {
        it('Should allow admins supply a user id to logout an authenticated user', (done) => {
          request(app).post('/api/v1/signup')
          .send({
            email: 'loggedOut@test.com',
            name: 'qwert',
            password: 'loggedOut0ne',
          })
          .end((err, res) => {
            const loggedOutUserId = res.body.user.id;
            const loggedOutUserToken = res.body.token;

            request(app).get(`/api/v1/logout/${loggedOutUserId}`)
            .send({
              token: adminToken,
            })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.include(`Logout of user ${loggedOutUserId} successful`);

              request(app).get('/api/v1/users/1')
              .send({
                token: loggedOutUserToken,
              })
              .end((err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include('User is logged out');
                done();
              });
            });
          });
        });

        it('Should return 404 if no matching user is found', (done) => {
          request(app).get('/api/v1/logout/100')
          .send({
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.include('User not found');
            done();
          });
        });

        it('Should logout a regular user that supplies any user id', (done) => {
          request(app).post('/api/v1/signup')
          .send({
            email: 'loggedOutSelf@test.com',
            name: 'qwert',
            password: 'loggedOut0ne',
          })
          .end((err, res) => {
            const loggedOutUserToken = res.body.token;

            request(app).get('/api/v1/logout/1')
            .send({
              token: loggedOutUserToken,
            })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('message');
              expect(res.body.message).to.include('Logout successful');

              request(app).get('/api/v1/users/1')
              .send({
                token: loggedOutUserToken,
              })
              .end((err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.include('User is logged out');
                done();
              });
            });
          });
        });
      });
    });
  });
};
