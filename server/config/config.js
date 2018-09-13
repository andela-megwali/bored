module.exports = {
  'development': {
    'username': process.env.DEV_DB_USERNAME,
    'password': process.env.DEV_DB_PASSWORD,
    'database': 'd3-practice1-todo',
    'host': process.env.DEV_HOST,
    'dialect': 'postgres',
    'secret': process.env.DEV_SECRET,
  },
  'test': {
    'username': 'enigma',
    'password': null,
    'database': 'database_test',
    'host': '127.0.0.1',
    'dialect': 'postgres',
    'secret': 'abcdefg',
  },
  'production': {
    'username': process.env.DEV_DB_USERNAME,
    'password': process.env.DEV_DB_PASSWORD,
    'database': process.env.DEV_DB,
    'host': process.env.DEV_HOST,
    'dialect': 'postgres',
    'secret': process.env.DEV_SECRET,
  },
};
