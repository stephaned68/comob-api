/**
 * Express Server 
 */

const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');

const result = dotenv.config({ debug: process.env.DEBUG });
if (result.error) {
  throw result.error
}
console.log(result.parsed);

const ip = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 8100;

const server = http.createServer(app);

server.listen(port, ip);