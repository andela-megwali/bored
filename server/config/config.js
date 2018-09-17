require('dotenv').config();

module.exports = {
  'development': {
    'username': process.env.DEV_DB_USERNAME,
    'password': process.env.DEV_DB_PASSWORD,
    'database': process.env.DEV_DB,
    'host': process.env.DEV_HOST,
    'dialect': process.env.DEV_DIALECT,
    'secret': process.env.DEV_SECRET,
  },
  'test': {
    'username': process.env.TEST_DB_USERNAME,
    'password': process.env.TEST_DB_PASSWORD,
    'database': process.env.TEST_DB,
    'host': process.env.TEST_HOST,
    'dialect': process.env.TEST_DIALECT,
    'secret': process.env.TEST_SECRET,
  },
  'production': {
    'username': process.env.PROD_DB_USERNAME,
    'password': process.env.PROD_DB_PASSWORD,
    'database': process.env.PROD_DB,
    'host': process.env.PROD_HOST,
    'dialect': process.env.PROD_DIALECT,
    'secret': process.env.PROD_SECRET,
  },
};
