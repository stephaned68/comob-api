const http = require('http');
const app = require('./app');

const ip = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 8100;

const server = http.createServer(app);

server.listen(port, ip);