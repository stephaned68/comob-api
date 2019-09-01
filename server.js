const http = require('http');
const app = require('./app');

let usePort;
for (let argv of process.argv) {
  if (argv.toLowerCase().startsWith('port=')) {
    usePort = argv.split('=')[1];
  }
}

const ip = process.env.IP || '127.0.0.1';
const port = process.env.PORT || (usePort || 8100);

const server = http.createServer(app);

server.listen(port, ip);