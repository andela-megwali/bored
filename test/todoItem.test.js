const db = require('../server/models');
const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect, request } = chai;

module.exports = () => {
  describe('TodoItems CRUD Actions', () => {
    let adminTodoId;
    let adminTodoItemId;
    let adminToken;
    let todoId;
    let todoItemId;
    let userId;
    let userToken;

    before((done) => {
      // Create a regular user
      request(app).post('/api/v1/signup')
      .send({
        email: 'todoItem@test.com',
        name: 'qwert',
        password: '123qwdfghjk',
      })
      .end((err, res) => {
        userId = res.body.user.id;
        userToken = res.body.token;

        // Create a todo

        request(app).post('/api/v1/todos')
        .send({
          token: userToken,
          title: 'Test todo with todo items',
        })
        .end((err, res) => {
          todoId = res.body.id;
        });

        // Login as admin user
        request(app).post('/api/v1/login')
        .send({
          email: 'admin@test.com',
          password: '123qwertyu',
        })
        .end((err, res) => {
          adminToken = res.body.token;

          // Create admin todo
          request(app).post('/api/v1/todos')
          .send({
            token: adminToken,
            title: 'Admin todo with todo items',
          })
          .end((err, res) => {
            adminTodoId = res.body.id;
            done();
          });
        });
      });
    });

    describe('Create TodoItem', () => {
      it('Should prevent unauthorized creation of todo items', (done) => {
        request(app).post('/api/v1/todos/1/todoItems')
        .send({
          content: 'New todo item',
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('You must be signed in to perform this action');
          done();
        });
      });

      it('Should prevent creation of todo items without a content field', (done) => {
        request(app).post('/api/v1/todos/1/todoItems')
        .send({
          content: '',
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.have.property('content');
          done();
        });
      });

      it('Should prevent creation of todo items for another user by non admins', (done) => {
        request(app).post('/api/v1/todos/1/todoItems')
        .send({
          content: 'hacking',
          token: userToken,
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('Forbidden');
          done();
        });
      });

      it('Should allow authorized users to create todo items', (done) => {
        request(app).post(`/api/v1/todos/${adminTodoId}/todoItems`)
        .send({
          content: 'New todo item',
          token: adminToken,
        })
        .end((err, res) => {
          adminTodoItemId = res.body.id;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('content');
          expect(res.body.content).to.equal('New todo item');
          expect(res.body.todoId).to.equal(adminTodoId);
          done();
        });
      });

      it('Should allow admin users to create todo items for other users', (done) => {
        request(app).post(`/api/v1/todos/${todoId}/todoItems`)
        .send({
          content: 'New admin todo item',
          token: adminToken,
        })
        .end((err, res) => {
          todoItemId = res.body.id;
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('content');
          expect(res.body.content).to.equal('New admin todo item');
          expect(res.body.todoId).to.equal(todoId);

          request(app).get(`/api/v1/todos/${todoId}`)
          .send({
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('createdAt', 'id', 'title', 'todoItems', 'updatedAt', 'userId');
            expect(res.body.todoItems).to.be.an('array');
            expect(res.body.todoItems).to.have.lengthOf(1);
            expect(res.body.todoItems[0].content).to.include('New admin todo item');
            done();
          });
        });
      });

      describe('Listing TodoItems', () => {
        it('Should allow authorized users to list all their todos items', (done) => {
          request(app).get(`/api/v1/todos/${todoId}`)
          .send({
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('todoItems');
            expect(res.body.todoItems).to.be.an('array');
            expect(res.body.todoItems).to.have.lengthOf(1);
            expect(res.body.todoItems[0].content).to.include('New admin todo item');
            done();
          });
        });
      });

      describe('Retrieving a TodoItem', () => {
        it('Should prevent unauthorized users from retrieving any todo item by id', (done) => {
          request(app).get(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
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

        it('Should prevent authorized users from retrieving other users todo items by id', (done) => {
          request(app).get(`/api/v1/todos/${adminTodoId}/todoItems/${adminTodoItemId}`)
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

        it('Should return 404 for authorized users when todo item is not found', (done) => {
          request(app).get(`/api/v1/todos/${adminTodoId}/todoItems/100`)
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

        it('Should allow authorized users to retrieve their own todo item by id', (done) => {
          request(app).get(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
          .send({
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('complete', 'content', 'createdAt', 'id', 'todoId', 'updatedAt');
            expect(res.body.content).to.equal('New admin todo item');
            expect(res.body.complete).to.equal(false);
            done();
          });
        });

        it('Should allow admin users to retrieve other users todo items by id', (done) => {
          request(app).get(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
          .send({
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('complete', 'content', 'createdAt', 'id', 'todoId', 'updatedAt');
            expect(res.body.content).to.equal('New admin todo item');
            done();
          });
        });
      });

      describe('Updating a TodoItem', () => {
        it('Should prevent unauthorized users from retrieving any todo item by id', (done) => {
          request(app).put(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
          .send({
            complete: true,
            token: '',
          })
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.include('You must be signed in to perform this action');
            done();
          });
        });

        it('Should prevent authorized users from updating other users todo items by id', (done) => {
          request(app).put(`/api/v1/todos/${adminTodoId}/todoItems/${adminTodoItemId}`)
          .send({
            complete: true,
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.include('Forbidden');
            done();
          });
        });

        it('Should return 404 for authorized users when todo item is not found', (done) => {
          request(app).put(`/api/v1/todos/${adminTodoId}/todoItems/100`)
          .send({
            complete: true,
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.include('Not found');
            done();
          });
        });

        it('Should allow authorized users to update their own todo item by id', (done) => {
          request(app).put(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
          .send({
            complete: true,
            token: userToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('complete', 'content', 'createdAt', 'id', 'todoId', 'updatedAt');
            expect(res.body.content).to.equal('New admin todo item');
            expect(res.body.complete).to.equal(true);
            done();
          });
        });

        it('Should validate content field for authorized users updating their todo item by id', (done) => {
          request(app).put(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
          .send({
            content: '',
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('errors');
            expect(res.body.errors).to.have.property('content');
            done();
          });
        });

        it('Should allow admin users to update other users todo items by id', (done) => {
          request(app).put(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
          .send({
            content: 'updated by admin todo item',
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.all.keys('complete', 'content', 'createdAt', 'id', 'todoId', 'updatedAt');
            expect(res.body.content).to.equal('updated by admin todo item');
            done();
          });
        });
      });

      describe('Deleting Todos', () => {
        it('Should prevent unauthorized users from deleting any todo item by id', (done) => {
          request(app).delete(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
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

        it('Should prevent authorized users from deleting other users todo item by id', (done) => {
          request(app).delete(`/api/v1/todos/${adminTodoId}/todoItems/${adminTodoItemId}`)
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

        it('Should allow authorized users to delete their own todo item by id', (done) => {
          request(app).delete(`/api/v1/todos/${adminTodoId}/todoItems/${adminTodoItemId}`)
          .send({
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(204);
            expect(res.body).to.eql({});
            done();
          });
        });

        it('Should allow admin users to delete other users todo by id', (done) => {
          request(app).delete(`/api/v1/todos/${todoId}/todoItems/${todoItemId}`)
          .send({
            token: adminToken,
          })
          .end((err, res) => {
            expect(res.status).to.equal(204);
            expect(res.body).to.eql({});
            done();
          });
        });

        it('Should return 404 to authorized users for todo item id not found', (done) => {
          request(app).delete(`/api/v1/todos/${todoId}/todoItems/100`)
          .send({
            token: userToken,
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
  });
};
