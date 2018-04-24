'use strict';

const {env} =  process;
const config = {
  port: 3003,
  db: {
    host: env.FRUIT_DB_HOST,
    port: 5432,
    database: 'fruitstore',
    user: env.FRUIT_DB_USER,
    max: env.FRUIT_DB_POOLSIZE
  }
};

module.exports = config;