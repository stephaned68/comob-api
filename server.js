/**
 * Express Server
 */

const http = require('http');
const dotenv = require('dotenv');
const pkg = require('./package.json');

const result = dotenv.config({
  silent: true,
  debug: process.env.DEBUG,
});
if (!result.error) {
  console.log('Parsed environment... ', result.parsed);
}

// Defaults to alwaysdata IP & PORT values
const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 8100;

const app = require('./app');
const server = http.createServer(app);

server.listen(port, ip, () => {
  console.log(`Started COMob API server v${pkg.version} on ${ip}:${port}...`);
});
