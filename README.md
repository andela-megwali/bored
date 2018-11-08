# Bored
Basic Todo Api with authentication

Clone repo
yarn install

create a .env file with the following keys:

```DEV_DB=
DEV_DB_USERNAME=
DEV_DB_PASSWORD=
DEV_HOST=127.0.0.1
DEV_DIALECT=postgres
DEV_SECRET=

yarn start:dev to run in dev mode
yarn test to run test

## Endpoints:

Faffing: get '/api/v1'
signup: post '/api/v1/signup'
login: post '/api/v1/login'

Get user: get('/api/v1/users/:userId'
update user: put('/api/v1/users/:userId'
delete user: delete('/api/v1/users/:userId'
logout: get('/api/v1/logout'
logout (admin): get('/api/v1/logout/:userId'

Create todo: post('/api/v1/todos'
List todos:  get('/api/v1/todos'
Get todo:   get('/api/v1/todos/:todoId'
update todo: put('/api/v1/todos/:todoId'
delete todo: delete('/api/v1/todos/:todoId'

Create todoItem: post('/api/v1/todos/:todoId/todoItems'
get todoItem: get('/api/v1/todos/:todoId/todoItems/:todoItemId'
update todoItem: put('/api/v1/todos/:todoId/todoItems/:todoItemId'
delete todoItem: delete('/api/v1/todos/:todoId/todoItems/:todoItemId'

## Note:
You need to update db directly to create the first admin user. Only an admin can elevate another user to admin status.
Admins are authorised to run any account.
