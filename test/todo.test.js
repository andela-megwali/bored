const db = require('../server/models');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect, request } = chai;

module.exports = () => {
  describe('Todo CRUD Actions', () => {
    let adminTodoId;
    let adminToken;
    let todoId;
    let userId;
    let userToken;

    before((done) => {
      // Create a regular user
      request(app).post('/api/v1/signup')
      .send({
        email: 'todo@test.com',
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

    describe('Create Todo', () => {
      it('Should prevent unauthorized creation of todos', (done) => {
        request(app).post('/api/v1/todos')
        .send({
          title: 'New todo',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('You must be signed in to perform this action');
          done();
        });
      });

      it('Should prevent creation of todos without a title', (done) => {
        request(app).post('/api/v1/todos')
        .send({
          title: '',
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('title');
          done();
        });
      });

      it('Should allow authorized users to create todos', (done) => {
        request(app).post('/api/v1/todos')
        .send({
          title: 'New todo',
          token: userToken,
        })
        .end((err, res) => {
          todoId = res.body.id;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'updatedAt', 'userId');
          expect(res.body.title).to.equal('New todo');
          expect(res.body.userId).to.equal(userId);
          done();
        });
      });
    });

    describe('Listing Todos', () => {
      it('Should allow authorized users to list all their todos', (done) => {
        request(app).post('/api/v1/todos')
        .send({
          title: 'Another todo',
          token: adminToken,
        })
        .end((err, res) => {
          adminTodoId = res.body.id;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'updatedAt', 'userId');
          expect(res.body.title).to.equal('Another todo');

          request(app).get('/api/v1/todos')
          .send({
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.have.all.keys('createdAt', 'id', 'title', 'todoItems', 'updatedAt', 'userId');
            expect(res.body[0].title).to.equal('Another todo');
            done();
          });
        });
      });
    });

    describe('Retrieving a Todo', () => {
      it('Should prevent unauthorized users from retrieving any todo by id', (done) => {
        request(app).get(`/api/v1/todos/${todoId}`)
        .send({
          token: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('You must be signed in to perform this action');
          done();
        });
      });

      it('Should prevent authorized users from retrieving other users todo by id', (done) => {
        request(app).get(`/api/v1/todos/${adminTodoId}`)
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

      it('Should allow authorized users to retrieve their own todo by id', (done) => {
        request(app).get(`/api/v1/todos/${todoId}`)
        .send({
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'todoItems', 'updatedAt', 'userId');
          expect(res.body.title).to.equal('New todo');
          done();
        });
      });

      it('Should allow admin users to retrieve other users todo by id', (done) => {
        request(app).get(`/api/v1/todos/${todoId}`)
        .send({
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'todoItems', 'updatedAt', 'userId');
          expect(res.body.title).to.equal('New todo');
          done();
        });
      });
    });

    describe('Updating a Todo', () => {
      it('Should prevent unauthorized users from updating any todo by id', (done) => {
        request(app).put(`/api/v1/todos/${todoId}`)
        .send({
          token: '',
          title: 'hacked'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('You must be signed in to perform this action');
          done();
        });
      });

      it('Should prevent authorized users from updating other users todo by id', (done) => {
        request(app).put(`/api/v1/todos/${adminTodoId}`)
        .send({
          title: 'New todo title',
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Forbidden');
          done();
        });
      });

      it('Should allow authorized users to update their own todo by id', (done) => {
        request(app).put(`/api/v1/todos/${todoId}`)
        .send({
          title: 'New todo title',
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'updatedAt', 'userId');
          expect(res.body.title).to.equal('New todo title');
          done();
        });
      });

      it('Should allow admin users to update other users todo by id', (done) => {
        request(app).put(`/api/v1/todos/${todoId}`)
        .send({
          title: 'New todo updated by admin',
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'updatedAt', 'userId');
          expect(res.body.title).to.equal('New todo updated by admin');
          done();
        });
      });

      it('Should validate title field for authorized users updating their todo by id', (done) => {
        request(app).put(`/api/v1/todos/${adminTodoId}`)
        .send({
          title: '',
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('title');
          done();
        });
      });
    });

    describe('Deleting Todos', () => {
      it('Should prevent unauthorized users from deleting any todo by id', (done) => {
        request(app).delete(`/api/v1/todos/${todoId}`)
        .send({
          token: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('You must be signed in to perform this action');
          done();
        });
      });

      it('Should prevent authorized users from deleting other users todo by id', (done) => {
        request(app).delete(`/api/v1/todos/${adminTodoId}`)
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

      it('Should allow authorized users to delete their own todo by id', (done) => {
        request(app).post('/api/v1/todos')
        .send({
          title: 'deleted todo',
          token: userToken,
        })
        .end((err, res) => {
          const deletedTodoId = res.body.id;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'updatedAt', 'userId');
          expect(res.body.title).to.equal('deleted todo');
          expect(res.body.userId).to.equal(userId);

          request(app).delete(`/api/v1/todos/${deletedTodoId}`)
          .send({
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(204);
            expect(res.body).to.eql({});
            done();
          });
        });
      });

      it('Should allow admin users to delete other users todo by id', (done) => {
        request(app).delete(`/api/v1/todos/${todoId}`)
        .send({
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(204);
          expect(res.body).to.eql({});
          done();
        });
      });

      it('Should return 404 to authorized users for todo id not found', (done) => {
        request(app).delete('/api/v1/todos/100')
        .send({
          token: adminToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Not found');
          done();
        });
      });
    });
  });
};
