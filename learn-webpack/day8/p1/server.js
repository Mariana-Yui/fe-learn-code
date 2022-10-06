const http = require('http');

const server = new http.Server();

server.on('request', (req, res) => {
  if (req.method === 'GET' && req.url === '/name') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.end(JSON.stringify({ name: 'mariana' }));
  }
});

server.listen(8888);
