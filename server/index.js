const fs = require('fs');
const path = require('path');
const Server = require('@core/server');

const server = new Server();
const { app } = server;
const sa = require('superagent');

//app.use('/xapi/wishlist/v1/lists/*', (req, res) => res.status(200).json(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../tests/fixtures/json/add-to-list-success.json'), 'utf8'))));

server.app.get('/xapi/discover/v1/product', (req, res) => {
  const newurl = `http://${process.env.XAPI_DOMAIN}${req.url}`;
  sa.get(newurl).pipe(res);
});

server.start();
