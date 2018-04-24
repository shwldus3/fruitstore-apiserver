'use strict';

global.config = require('./config');

const restify = require('restify');
const server = restify.createServer({
  name: 'Fruit Store',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

require('./route').init(server);

server.listen(3003, () =>
  console.log(`${server.name} listening at ${server.url}`)
);